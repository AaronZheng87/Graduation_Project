library(tidyverse) # data wrangling, plotting
library(brms)      # Bayesian analysis
library(rstan)     # Bayesian analysis
library(tidyverse)
library(here)
library(hypr)
library(bridgesampling)
#devtools::install_github("RobinHankin/Brobdingnag")
#update.packages("dbplyr")

dat <- read_csv("/Users/zhengyuanrui/Graduation_Project/Analysis/data/dat.csv")



df_bf <- dat %>% 
  mutate(across(subj_idx:shape, as.factor)) %>% 
  rename(matchness = Match)


v <- hypr(
  bad_good = bad ~ good, 
  neu_good = ordinary ~ good, 
  levels = c("bad", "good", "ordinary")
)

contrasts(df_bf$valence) <- contr.hypothesis(v)

m <- hypr(
  m_mis = match ~ mismatch, 
  levels = c("match", "mismatch")
)

contrasts(df_bf$matchness) <- contr.hypothesis(m)

levels(df_bf$shape)
s <- hypr(
  word_sim= circular ~ square,  
  image_sim = square ~triangle, 
  levels = c("circular", "square", "triangle")
)
contrasts(df_bf$shape) <- contr.hypothesis(s)

df_bf1 <- df_bf %>% 
  filter(subj_idx == "v010001")

model01 <- brm(rt ~ valence * matchness + (valence * matchness|subj_idx), 
              data = df_bf1, 
              family = gaussian(),
              save_all_pars = TRUE)

model02 <- brm(rt ~ valence + matchness + (valence * matchness|subj_idx), 
    data = df_bf1, 
    family = gaussian(),
    save_all_pars = TRUE)

summary(model01)

summary(model02)

BF <- bridgesampling::bayes_factor(model01, model02)
BF[["bf"]]

##########################################BF##############
df_bf$subj_idx <- as.character(df_bf$subj_idx)

subjects <- unique(df_bf$subj_idx)

N_total <- length(unique(df_bf$subj_idx))

BFs_int <- rep(1, N_total)

for (i in 1:N_total) {
  if (i == 1) {
    next
  }
  data <- subset(df_bf, subj_idx %in% head(subjects, i))

  print(paste0(i, sep = " ", "subjects"))
  
  model1 <- brm(rt ~ valence * matchness + (valence * matchness|subj_idx), 
                data = data, 
                family = gaussian(),
                save_all_pars = TRUE)
  
  gc()
  
  summary(model1)
  
  model2 <- brm(rt ~ valence + matchness + (valence * matchness|subj_idx), 
                data = data, 
                family = gaussian(),
                save_all_pars = TRUE)
  
  summary(model2)
  
  BFs_int[i] <- bridgesampling::bayes_factor(model1, model2)[["bf"]]
  
  
}

BFs_int