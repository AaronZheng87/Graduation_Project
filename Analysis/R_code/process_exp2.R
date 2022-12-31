library(tidyverse)
library(jsonlite)


filenames <- list.files("/Users/zhengyuanrui/Graduation_Project/Analysis/data/test_data/exp2_data", pattern = "csv", full.names = TRUE)

data <- list()


for (i in seq_along(filenames)){
  data[[i]] <- read_csv(filenames[i])
  data[[i]]$subj_idx <- jsonlite::fromJSON(data[[i]]$response[5])$Q0
  
  data[[i]]$gender <- jsonlite::fromJSON(data[[i]]$response[6]) 
  
  data[[i]]$year <- jsonlite::fromJSON(data[[i]]$response[7])$Q0 
  data[[i]]$education <- jsonlite::fromJSON(data[[i]]$response[8])$Q0
  data[[i]]$dist <- data[[i]]$view_dist_mm[9]
  data[[i]] <- data[[i]] %>% 
    select(subj_idx, year, education, dist, trial_type, rt, response, 
           key_press, condition, correct_response, correct, word, Image) %>% 
    filter(trial_type == "psychophysics")
  
  data[[i]] <- data[[i]] %>% 
    filter(trial_type == "psychophysics") %>% 
    mutate(
      shape_en = case_when(
        Image == "img/C_ambi40.png" ~ "circle",
        ###这里不同实验需修改图形命名
        Image == "img/T_ambi40.png" ~ "triangle",
        Image == "img/S_ambi40.png" ~ "square"
      )
    ) %>% 
    mutate(
      valence = case_when(
        word == "好人" ~ "Good",
        ###这里不同实验需修改label的命名
        word == "坏人" ~ "Bad",
        word == "常人" ~ "Neutral"
      )
    ) %>% 
    mutate(
      ACC = case_when(
        correct == "FALSE" ~ 0, 
        correct == "TRUE" ~ 1
      )
    ) %>% 
    filter(!grepl("prac_", condition)) %>% 
    mutate(exp = "exp2")
}

df <- do.call(rbind, data)



df$subj_idx <- as.numeric(df$subj_idx)


df2 <- df %>% 
  mutate(matchness = 
           case_when(subj_idx %% 2 == 1 & correct_response == "j" ~ "match", 
                     subj_idx %% 2 == 1 & correct_response == "f" ~ "mismatch", 
                     subj_idx %% 2 == 0 & correct_response == "f" ~ "match", 
                     subj_idx %% 2 == 0 & correct_response == "j" ~ "mismatch"))


s6 <- df2 %>% 
  filter(subj_idx == 6) %>% 
  group_by(valence, matchness, condition) %>% 
  summarise(n = n())


df3 <- df2 %>% 
  filter(rt != "null")

# write_csv(df3, "clean_test.csv")
