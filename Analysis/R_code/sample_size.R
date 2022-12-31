library(tidyverse) # data wrangling, plotting
library(brms)      # Bayesian analysis
library(rstan)     # Bayesian analysis
library(tidyverse)
library(here)
library(hypr)
library(bridgesampling)
#devtools::install_github("RobinHankin/Brobdingnag")
#update.packages("dbplyr")


options(mc.cores = parallel::detectCores())


dat <- read_csv("/Users/zhengyuanrui/Graduation_Project/Analysis/R_code/clean_test.csv")

df_bf <- dat %>% 
  select(subj_idx, exp, valence, condition, matchness, ACC, rt) %>% 
  mutate(across(subj_idx:matchness, as.factor))

head(df_bf)



v <- hypr(
  bad_good = Bad ~ Good, 
  neu_good = Neutral ~ Good, 
  levels = c("Bad", "Good", "Neutral")
)

contrasts(df_bf$valence) <- contr.hypothesis(v)

m <- hypr(
  m_mis = match ~ mismatch, 
  levels = c("match", "mismatch")
)

contrasts(df_bf$matchness) <- contr.hypothesis(m)

# levels(df_bf$shape)

# s <- hypr(
#   word_sim= circular ~ square,  
#   image_sim = square ~triangle, 
#   levels = c("circular", "square", "triangle")
# )


# contrasts(df_bf$shape) <- contr.hypothesis(s)



model01 <- brm(rt ~ valence * matchness * condition + (valence * matchness * condition|subj_idx), 
              data = df_bf, 
              family = gaussian(),
              control = list(adapt_delta = .99, max_treedepth = 12),
              save_all_pars = TRUE)

model02 <- brm(rt ~ valence + matchness + condition + valennce:matchness + valence:condition + matchness:condition + (valence * matchness * condition|subj_idx), 
    data = df_bf, 
    family = gaussian(),
    control = list(adapt_delta = .99, max_treedepth = 12),
    save_all_pars = TRUE)

summary(model01)

summary(model02)

BF <- bridgesampling::bayes_factor(model01, model02)
BF[["bf"]]

##########################################BF##############
df_bf$subj_idx <- as.character(df_bf$subj_idx)

subjects <- unique(df_bf$subj_idx)

N_total <- length(unique(df_bf$subj_idx))

Ns  <- c(seq(2, N_total, by = 2), N_total)

BFs_int <- c()

for (i in Ns) {
  data <- subset(df_bf, subj_idx %in% head(subjects, i))

  print(paste0(i, sep = " ", "subjects"))
  
  model1 <- brm(rt ~ valence * matchness * condition + (valence * matchness * condition|subj_idx), 
                data = data, 
                family = gaussian(),
                save_all_pars = TRUE)
  
  gc()
  
  summary(model1)
  
  model2 <- brm(rt ~ valence + matchness + condition + valence:matchness + valence:condition + matchness:condition + (valence * matchness * condition|subj_idx), 
                data = data, 
                family = gaussian(),
                save_all_pars = TRUE)
  
  summary(model2)
  
  BFs_int <- append(BFs_int, bridgesampling::bayes_factor(model1, model2)[["bf"]])
  
  
}

BFs_int
