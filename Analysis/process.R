library(tidyverse)
library(jsonlite)



filenames <- list.files("/Users/zhengyuanrui/Downloads/data/", pattern = "csv", full.names = TRUE)

data <- list()


for (i in seq_along(filenames)) {
  data[[i]] <- read_csv(filenames[i])
  data[[i]] <- data[[i]] %>% 
    select(trial_type, rt, internal_node_id, rt, response, 
           key_press, condition, correct_response, correct, word, Image)
  
  data[[i]] <- data[[i]] %>% 
    filter(
      trial_type == "survey-html-form" |
        trial_type == "html-button-response" |
        trial_type == "psychophysics"
    )
  
  data[[i]]$subj_idx <- jsonlite::fromJSON(data[[i]]$response[1])$Q0
  
  data[[i]]$gender <- jsonlite::fromJSON(data[[i]]$response[2]) 
  
  data[[i]]$year <- jsonlite::fromJSON(data[[i]]$response[3])$Q0 #删了
  
  
  data[[i]]$education <- jsonlite::fromJSON(data[[i]]$response[4])$Q0
  
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
        word == "方形" ~ "square",
        ###这里不同实验需修改label的命名
        word == "圆形" ~ "circle",
        word == "三角" ~ "triangle"
      )
    ) %>% 
    mutate(
      ACC = case_when(
        correct == "FALSE" ~ 0, 
        correct == "TRUE" ~ 1
      )
    ) %>% 
    filter(!grepl("prac_", condition))
}

df <- do.call(rbind, data)

df %>% 
  group_by(condition) %>% 
  summarise(n = n())
