library(tidyverse) # data wrangling, plotting
library(brms)      # Bayesian analysis
library(rstan)     # Bayesian analysis
library(tidyverse)
library(here)
library(hypr)
#devtools::install_github("RobinHankin/Brobdingnag")
#update.packages("dbplyr")

df <- read_csv("/Users/zhengyuanrui/Graduation_Project/Analysis/data/simple_sim.csv")

head(df)

df_bf <- df %>% 
  select(sub_id, valence, matchness, sequence, dv) %>% 
  mutate(across(valence:sequence, as.factor))
HcHel <- hypr(
  b1 = ordinary ~ bad,
  b2 = good ~ (bad + ordinary) / 2,
  levels = c("bad", "ordinary", "good")
)

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


s <- hypr(
  word_sim= word_first ~ simultaneus,  
  image_sim = image_first ~simultaneus, 
  levels = c("image_first", "simultaneus", "word_first")
)
contrasts(df_bf$sequence) <- contr.hypothesis(s)

model1 <- brm(dv ~ valence * matchness * sequence + (valence * matchness * sequence|sub_id), 
              data = df_bf, 
              family = gaussian(),
              chains = 1,
              iter   = 1000,
              warmup = 500,
              control = list(adapt_delta = .99, max_treedepth = 12),
              save_all_pars = TRUE)

model2 <- brm(dv ~ valence + matchness + sequence + valence:matchness + valence:sequence + matchness:sequence + valence:matchness:sequence + (valence * matchness * sequence|sub_id), 
    data = df_bf, 
    family = gaussian(),
    chains = 1,
    iter   = 1000,
    warmup = 500,
    control = list(adapt_delta = .99, max_treedepth = 12),
    save_all_pars = TRUE)

summary(model1)

summary(model2)

bridgesampling::bayes_factor(model1, model2)
##########################################BF##############
df_bf$sub_id <- as.character(df_bf$sub_id)

subjects <- unique(df_bf$sub_id)

N_total <- length(unique(df_bf$sub_id))


for (i in N_total) {
  data <- subset(df_bf, sub_id %in% head(subjects, i))
  message(length(unique(data$sub_id)), " subjects")
  
  model1 <- brm(dv ~ valence * matchness * sequence + (valence * matchness * sequence|sub_id), 
                data = data, 
                family = gaussian(),
                chains = 1,
                iter   = 50,
                warmup = 10,
                control = list(adapt_delta = .99, max_treedepth = 12),
                save_all_pars = TRUE)
  
  gc()
  
  summary(model1)
  
  model2 <- brm(dv ~ valence + matchness + sequence + valence:matchness + valence:sequence + matchness:sequence + valence:matchness:sequence + (valence * matchness * sequence|sub_id), 
                data = data, 
                family = gaussian(),
                chains = 1,
                iter   = 50,
                warmup = 10,
                control = list(adapt_delta = .99, max_treedepth = 12),
                save_all_pars = TRUE)
  
  summary(model2)
  
  (BF <- bayes_factor(model1, model2))
  
  tmp <- data.frame(beta = "N400 constraint", N = i, BF = BF[[1]])
  
  return(tmp)
}





