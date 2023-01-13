library(tidyverse) # data wrangling, plotting
library(brms)      # Bayesian analysis
library(rstan)     # Bayesian analysis
library(tidyverse)
library(here)
library(hypr)
library(bridgesampling)
#devtools::install_github("RobinHankin/Brobdingnag")
#update.packages("dbplyr")
#installed.packages()[names(sessionInfo()$otherPkgs), "Version"]

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




###############################

bf_result <- data.frame(effect = "inx", N = NA, BF = NA)

subj <- sort(unique(df_bf$subj_idx))#对被试编号进行排序

Ns <- c(seq(3, 6, by = 3))#每三个被试测一次（未来看情况修改）

for (i in Ns) {
  data <- subset(df_bf, subj_idx %in% head(subj, i))
  
  message(length(unique(data$subj_idx)), " subjects")

  model1 <- brm(rt ~ valence * matchness * condition + (valence * matchness * condition|subj_idx),
                data = data,
                family = gaussian(),
                iter=10000, warmup=2000, chains = 4,
                control = list(adapt_delta = .99, max_treedepth = 12),  
                save_pars = save_pars(all = TRUE))

  gc()

  summary(model1)

  model2 <- brm(rt ~ valence + matchness + condition + valence:matchness + valence:condition + matchness:condition + (valence * matchness * condition|subj_idx),
                data = data,
                family = gaussian(),
                iter=10000, warmup=2000, chains = 4,
                control = list(adapt_delta = .99, max_treedepth = 12),  
                save_pars = save_pars(all = TRUE))

  summary(model2)

  (BF = bayes_factor(model1, model2))

  tmp <- data.frame(effect = "inx", N = i, BF = BF[[1]])
  bf_result <- rbind(bf_result, tmp)
  print(bf_result)
}







