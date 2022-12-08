const jsPsych = initJsPsych({
    /* auto_update_progress_bar: true,
     extensions: {
       type: naodao,
     }*/
     on_finish: function() {
      jsPsych.data.get().localSave('csv', info["ID"] + '.csv'); 
      document.exitFullscreen(); // 退出全屏
      let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
            }
     });
  
  
  
  var timeline = [] //设置一个时间线
  
  
  // function getwidth(){
  //   let screen_width = screen.width;
  //   let stimuli_width_mm = Math.tan(3.8/180*Math.PI)*1000;
  //   let stimuli_width_px =    / 25.4 * ppi;
  
  // }
  
  
  
  const images = ['img/C_ambi40.png', 
  'img/S_ambi40.png', 
  'img/T_ambi40.png']
  
  const preload = {
      type: jsPsychPreload,
      images: images,
    }
  timeline.push(preload);//preload图片
  
  var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
     <p>您好，欢迎参加本次实验。</p>
     <p>为充分保障您的权利，请确保您已经知晓并同意《参与实验同意书》以及《数据公开知情同意书》。</p>
     <p>如果您未见过上述内容，请咨询实验员。</p>
     <p>如果您选择继续实验，则表示您已经清楚两份知情同意书的内容并同意。</p>
     <p> <div style = "color: green"><按任意键至下页></div> </p>
     `,
    choices: "ALL_KEYS",
  };
  timeline.push(welcome);
  
  var basic_information = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
     <p>本实验首先需要您填写一些基本个人信息。</p>
     <p> <div style = "color: green"><按任意键至下页></div></p>
     `,
    choices: "ALL_KEYS",
  };
  timeline.push(basic_information);
  
  var info = []
  
  /* basic data collection jsPsychInstructions trial 被试基本信息收集 */
  var information = {
    timeline: [{
    // 实验被试信息收集
    type: jsPsychCallFunction, //探测被试显示器数据
    func: function () {
      if ($(window).outerHeight() < 500) {
        alert("您设备不支持实验，请进入全屏模式。若已进入全屏，请换一台高分辨率的设备，谢谢。");
        window.location = "";
      }
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style =' color : white'>您的实验编号是</p>",
    html: function () {
      let data = localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["Name"] : "";
      return "<p><input name='Q0' type='text' value='" + data + "' required/></p>";
    },
    button_label: "继续",
    on_finish: function (data) {
        info["ID"] = data.response.Q0;
        word = permutation(texts, 3) //对应的文字
        texts = word[parseInt(info["ID"]) % 6] //被试id除以6，求余数
        key = permutation(key, 2)[parseInt(info["ID"]) % 2] //对应的按键
  
        view_texts_images = [] //指导语中呈现的图片和文字对应关系
        jsPsych.randomization.shuffle(images).forEach((v, i) => { //将image随机
          view_texts_images.push(`<img src="${v}" width=150 style="vertical-align:middle">---${texts[images.indexOf(v)]}`); //image编号和文字对应
        })
        console.log(`match : ${key[0]}; \nmismatch : ${key[1]};`)
        console.log(images);
        console.log(texts);
      }
  
    }
  , {
    type: jsPsychHtmlButtonResponse,
    stimulus: "<p style = 'color : white'>您的性别</p>",
    choices: ['男', '女', '其他'],
    on_finish: function (data) {
      info["Sex"] = data.response == 0 ? "Male" : (data.response == 1 ? "Female" : "Other")
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style = 'color : white'>您的出生年</p>",
    html: function () {
      let data = localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["BirthYear"] : "";
      return `<p>
        <input name="Q0" type="number" value=${data} placeholder="1900~2023" min=1900 max=2023 oninput="if(value.length>4) value=value.slice(0,4)" required />
        </p>`
    },
    button_label: '继续',
    on_finish: function (data) {
      info["BirthYear"] = data.response.Q0;
    }
  }, {
    type: jsPsychSurveyHtmlForm,
    preamble: "<p style = 'color : white'>您的教育经历是</p>",
    html: function () {
      return `
                <p><select name="Q0" size=10>
                <option value=1>小学以下</option>
                <option value=2>小学</option>
                <option value=3>初中</option>
                <option value=4>高中</option>
                <option value=5>大学</option>
                <option value=6>硕士</option>
                <option value=7>博士</option>
                <option value=8>其他</option>
                </select></p>`
    },
    on_load: function () {
      $("option[value=" + (["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"].indexOf(localStorage.getItem(info["subj_idx"]) ? JSON.parse(localStorage.getItem(info["subj_idx"]))["Education"] : "") + 1) + "]").attr("selected", true);
    },
    button_label: '继续',
    on_finish: function (data) {
      let edu = ["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"];
  
      info["Education"] = edu[parseInt(data.response.Q0) - 1];
    }
  }
  ] };
  
  
  timeline.push(information);
  
  
  var chinrest = {
    type: jsPsychVirtualChinrest,
    blindspot_reps: 3,
    resize_units: "deg",
    pixels_per_unit: 50,
    item_path:'img/card.png',
    adjustment_prompt: function(){
      let html = `<p style = "font-size: 28px">首先，我们将快速测量您的显示器上像素到厘米的转换比率。</p>`;
      html += `<p style = "font-size: 28px">请您将拿出一张真实的银行卡放在屏幕上方，单击并拖动图像的右下角，直到它与屏幕上的信用卡大小相同。</p>`;
      html += `<p style = "font-size: 28px">您可以使用与银行卡大小相同的任何卡，如会员卡或驾照，如果您无法使用真实的卡，可以使用直尺测量图像宽度至85.6毫米。</p>`;
      html += `<p style = "font-size: 28px"> 如果对以上操作感到困惑，请参考这个视频： <a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a></p>`;
      return html
    },
    blindspot_prompt: function(){
      return `<p style="text-align:left">现在，我们将快速测量您和屏幕之间的距离：<br>
      请把您的左手放在 空格键上<br>
      请用右手遮住右眼<br>
      请用您的左眼专注于黑色方块。将注意力集中在黑色方块上.<br>
      红色的球将从右向左移动，并将消失。当球一消失，就请按空格键<br>
      如果对以上操作感到困惑，请参考这个视频：<a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a><br>
      <a style="text-align:center">准备开始时，请按空格键。</a></p>`
    },
    blindspot_measurements_prompt: `剩余测量次数：`,
    on_finish: function(data){
      console.log(data)
    },
    redo_measurement_button_label: `还不够接近，请重试`,
    blindspot_done_prompt: `是的`,
    adjustment_button_prompt: `图像大小对准后，请单击此处`,
    viewing_distance_report: `<p>根据您的反应，您坐在离屏幕<span id='distance-estimate' style='font-weight: bold;'></span> 的位置。<br>这大概是对的吗？</p> `,
  };
  
  //timeline.push(chinrest)
  
  
  var fullscreen_trial = {
      type: jsPsychFullscreen,
      fullscreen_mode: true,
      message: "<p><span class='add_' style='color:white; font-size: 25px;'> 实验需要全屏模式，实验期间请勿退出全屏。 </span></p >",
      button_label: " <span class='add_' style='color:black; font-size: 25px;'> 点击这里进入全屏</span>"
    }
  
  timeline.push(fullscreen_trial);//将全屏设置放入到时间线里
  
  
  
    function permutation(arr, num) { //定义排列组合的function
      var r = [];
      (function f(t, a, n) {
        if (n == 0) return r.push(t);
        for (var i = 0, l = a.length; i < l; i++) {
          f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
        }
      })([], arr, num);
      return r;
    }
  
  
  
  var texts = ["好人", "坏人", "常人"]//储存文字
  
  var key = ['f', 'j']//按键
  //正确率70%
  let acc = 70;
  let view_texts_images = [];
  
  
  
  
    var Instructions1 = {//麻烦东哥修改一下
      type: jsPsychInstructions,
      pages: function () {
        let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
          middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
          end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入刺激呈现顺序为<span style='color: yellow;'>先图形后文字条件</span>的练习</span></p><div>";
        let tmpI = "";
        view_texts_images.forEach(v => {
          tmpI += `<p class="content">${v}</p>`;
        });
        return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好，欢迎参加本实验。本次实验大约需要30分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
          start + `<div class="box">${tmpI}</div>` +
          `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是在不同图形和文字呈现顺序的条件下判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
          `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成三组不同的刺激呈现顺序：<span style="color: yellow; ">先图形后文字、先文字后图形以及图形和文字同时呈现</span>条件下，每组72次按键的匹配任务练习。</p><p style='color:white; font-size: 25px; line-height: 30px;'>完成匹配任务的练习之后，您将完成每个条件下4组匹配任务，每组包括72次按键反应，每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要5分钟，整个实验将持续大约35分钟。</p>`,//实验时间待修改
          middle + end];
      },
      show_clickable_nav: true,
      button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
      button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
      on_load: () => {
        $("body").css("cursor", "default");
      },
      on_finish: function () {
        $("body").css("cursor", "none");
      } //鼠标消失术，放在要消失鼠标的前一个事件里
    }
    timeline.push(Instructions1);
  
  
  
  
  
  
    let prac_i = {
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
          {
              obj_type: 'cross',
              startX: "center", // location of the cross's center in the canvas
              startY: "center",
              line_length: 40,
              line_width: 5,
              line_color: 'white', // You can use the HTML color name instead of the HEX color.
              show_start_time: 500,
              show_end_time: 1000// ms after the start of the trial
          }, 
          {
              obj_type:"image",
              file: function(){return jsPsych.timelineVariable("Image")},
              startX: "center", // location of the cross's center in the canvas
              startY: "center",
              width: 190,  // 调整图片大小 视角：3.8° x 3.8°
              heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
              show_start_time: 1000, // ms after the start of the trial
              show_end_time: 1050,//出现50ms
              origin_center: true//待确定
          },//上一组end时间减去下一组show时间就是空屏的100ms
          {
              obj_type: 'text',
              file: function(){return function(){return jsPsych.timelineVariable("word")}},
              startX: "center",
              startY: "center", //图形和文字距离 与加号等距
              content: function () {
                return jsPsych.timelineVariable('word', true);
              },
              font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
  
              text_color: 'white',
              show_start_time: 1150, // ms after the start of the trial
              show_end_time: 1200,//出现50ms
              origin_center: true//带确定
            }
          ],
  
      choices: ['f', 'j'],
      response_start_time:1150,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image");
          data.word = jsPsych.timelineVariable("word");
          data.condition = "prac_image_first"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,//正是实验时改为6
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   }
  
  
   var feedback_p = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
        //这里填入timeline_variables里面的trial数量
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                              <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>";
      }
    }
  
  
  
  var feedback_continue_practice1 = { //在这里呈现文字recap，让被试再记一下
    type: jsPsychInstructions,
    pages: function () {
      let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
        middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
        end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
      let tmpI = "";
      view_texts_images.forEach(v => {
        tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
      });
      return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入下一阶段练习的要求。</p>",
        start + `<div class="box">${tmpI}</div>` +
        `<p class='footer' style='font-size:25px; line-height:30px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='font-size:25px; line-height:30px;'>如果二者匹配，请按 <span style="color: lightgreen;">${key[0]} 键</span></p><p class='footer' style='font-size:25px'>如果二者不匹配，请按<span style="color: lightgreen;"> ${key[1]} 键</p></span><p class='footer' style='font-size:22px; line-height:25px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上进行按键。</p></span>`,
        middle + end];
    },
    show_clickable_nav: true,
    button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
    button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
    on_finish: function () {
      $("body").css("cursor", "none");
    },
    on_load: () => {
      $("body").css("cursor", "default");
    }
  }
  
  
  var if_node1 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
      timeline: [feedback_p, feedback_continue_practice1],
      conditional_function: function (data) {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//达标就skip掉feedback_continue_practice这一段
        } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
          return true;
        }
      }
    }
  
  
  
    var loop_node1 = {
      timeline: [prac_i, if_node1],
      loop_function: function () {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//记得改，取数据
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//end 进入正式实验前的反馈
        } else if (accuracy < acc) { // repeat
          return true;
        }
      }
    }
    //timeline.push(loop_node1);
  
  
  var prac_w = {
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
          {
              obj_type: 'cross',
              startX: "center", // location of the cross's center in the canvas
              startY: "center",
              line_length: 40,//pixels 视角：0.8° x 0.8°
              line_width: 5,
              line_color: 'white', // You can use the HTML color name instead of the HEX color.
              show_start_time: 500,
              show_end_time: 1000// ms after the start of the trial
          }, 
          {
              obj_type:"image",
              file: function(){return jsPsych.timelineVariable("Image")},
              startX: "center", // location of the cross's center in the canvas
              startY: "center",
              width: 190,  // 调整图片大小 视角：3.8° x 3.8°
              heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
              show_start_time: 1150, // ms after the start of the trial
              show_end_time: 1200,//出现50ms
          },//上一组end时间减去下一组show时间就是空屏的100ms
          {
              obj_type: 'text',
              file: function(){return jsPsych.timelineVariable("word")},
              startX: "center",
              startY: "center", //图形和文字距离 与加号等距
              content: function () {
                return jsPsych.timelineVariable('word', true);
              },
              font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°, //字体和颜色设置 文字视角：3.6° x 1.6°
  
              text_color: 'white',
              show_start_time: 1000, // ms after the start of the trial
              show_end_time: 1050,//出现50ms
              origin_center: true
            }
          ],
  
          choices: ['f', 'j'],
      response_start_time:1150,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image");
          data.word = jsPsych.timelineVariable("word");
          data.condition = "prac_word_first"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   }
  
    var feedback_gow = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                              <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
          "<p class='context'>恭喜您完成这一阶段的练习。按任意键进入<span style='color: yellow;'>先文字后图形条件</span>的练习。</p></div>";
      },
      on_finish: function () {
        $("body").css("cursor", "none");
      }
    }
    //timeline.push(feedback_gow);
  
  var feedback_continue_practice2 = { //在这里呈现文字recap，让被试再记一下
    type: jsPsychInstructions,
    pages: function () {
      let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
        middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
        end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
      let tmpI = "";
      view_texts_images.forEach(v => {
        tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
      });
      return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入下一阶段练习的要求。</p>",
        start + `<div class="box">${tmpI}</div>` +
        `<p class='footer' style='font-size:25px; line-height:30px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='font-size:25px; line-height:30px;'>如果二者匹配，请按 <span style="color: lightgreen;">${key[0]} 键</span></p><p class='footer' style='font-size:25px'>如果二者不匹配，请按<span style="color: lightgreen;"> ${key[1]} 键</p></span><p class='footer' style='font-size:22px; line-height:25px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上进行按键。</p></span>`,
        middle + end];
    },
    show_clickable_nav: true,
    button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
    button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
    on_finish: function () {
      $("body").css("cursor", "none");
    },
    on_load: () => {
      $("body").css("cursor", "default");
    }
  }
  
  
    var if_node2 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
      timeline: [feedback_p, feedback_continue_practice2],
      conditional_function: function (data) {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//达标就skip掉feedback_continue_practice这一段
        } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
          return true;
        }
      }
    }
  
  
    var loop_node2 = {
      timeline: [prac_w, if_node2],
      loop_function: function () {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//记得改，取数据
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//end 进入正式实验前的反馈
        } else if (accuracy < acc) { // repeat
          return true;
        }
      }
    }
    //timeline.push(loop_node2);
  
  
  
    var prac_s = {//麻烦东哥修改一下
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
          {
              obj_type: 'cross',
              startX: "center", // location of the cross's center in the canvas
              startY: "center",
              line_length: 40, // pixels 视角：0.8° x 0.8°
              line_width: 5,
              line_color: 'white', // You can use the HTML color name instead of the HEX color.
              show_start_time: 500,
              show_end_time: 1100// ms after the start of the trial
          }, 
         {
              obj_type:"image",
              file: function(){return jsPsych.timelineVariable("Image")},
              startX: "center", // location of the cross's center in the canvas
              startY: -175, //图形和文字距离 与加号等距
              width: 190,  // 调整图片大小 视角：3.8° x 3.8°
              heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
              show_start_time: 1000, // ms after the start of the trial
              show_end_time: 1100,//出现50ms
              origin_center: true
          },//上一组end时间减去下一组show时间就是空屏的100ms
          {
              obj_type: 'text',
              file: function(){return jsPsych.timelineVariable("word")},
              startX: "center",
              startY: 175, //图形和文字距离 与加号等距2度
              content: function () {
                return jsPsych.timelineVariable("word", true);
              },
              font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
              text_color: 'white',
              show_start_time: 1000, // ms after the start of the trial
              show_end_time: 1100,//出现50ms
              origin_center: true
            }
          ],
  
          choices: ['f', 'j'],
         // canvas_width: 800,
         // canvas_height: 800,
      response_start_time:1100,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image");
          data.word = jsPsych.timelineVariable("word");
          data.condition = "prac_simultaneous"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,//正是实验时改为6
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   } 
  
    var feedback_gos = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                              <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
          "<p class='context'>恭喜您完成练习。按任意键进入<span style='color: yellow;'>图形和文字同时呈现条件</span>的练习。</p></div>";
      },
      on_finish: function () {
        $("body").css("cursor", "none");
      }
    }
   // timeline.push(feedback_gos);
  
  var feedback_continue_practice3 = { //在这里呈现文字recap，让被试再记一下
      type: jsPsychInstructions,
      pages: function () {
        let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
          middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
          end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
        let tmpI = "";
        view_texts_images.forEach(v => {
          tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
        });
        return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入下一阶段练习的要求。</p>",
          start + `<div class="box">${tmpI}</div>` +
          `<p class='footer' style='font-size:25px; line-height:30px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='font-size:25px; line-height:30px;'>如果二者匹配，请按 <span style="color: lightgreen;">${key[0]} 键</span></p><p class='footer' style='font-size:25px'>如果二者不匹配，请按<span style="color: lightgreen;"> ${key[1]} 键</p></span><p class='footer' style='font-size:22px; line-height:25px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上进行按键。</p></span>`,
          middle + end];
      },
      show_clickable_nav: true,
      button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
      button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
      on_finish: function () {
        $("body").css("cursor", "none");
      },
      on_load: () => {
        $("body").css("cursor", "default");
      }
    }
  
  
    var if_node3 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
      timeline: [feedback_p, feedback_continue_practice3],
      conditional_function: function (data) {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//达标就skip掉feedback_continue_practice这一段
        } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
          return true;
        }
      }
    }
  
  
    var loop_node3 = {
      timeline: [prac_s, if_node3],
      loop_function: function () {
        var trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);//记得改，取数据
        var correct_trials = trials.filter({
          correct: true
        });
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= acc) {
          return false;//end 进入正式实验前的反馈
        } else if (accuracy < acc) { // repeat
          return true;
        }
      }
    }
    //timeline.push(loop_node3);
  
  
  
  
  
  
  var feedback_goformal = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                              <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
          "<p class='context'>恭喜您完成练习。按任意键进入正式实验。</p>" + 
          "<p class='footer' style='font-size: 35px; line-height:40px;'>请在进入正式实验实验之前将您的<span style='color: lightgreen;'>食指</span>放在电脑键盘的相应键位上进行按键。</p>"
      },
      on_finish: function () {
        $("body").css("cursor", "none");
      }
    }
    //timeline.push(feedback_goformal);
  
  
  
  let image_first = {
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40,
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1000// ms after the start of the trial
      }, 
      {
          obj_type:"image",
          file: function(){return jsPsych.timelineVariable("Image")},
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1050,//出现50ms
          origin_center: true//待确定
      },//上一组end时间减去下一组show时间就是空屏的100ms
      {
          obj_type: 'text',
          file: function(){return function(){return jsPsych.timelineVariable("word")}},
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true);
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
  
          text_color: 'white',
          show_start_time: 1150, // ms after the start of the trial
          show_end_time: 1200,//出现50ms
          origin_center: true//带确定
        }
          ],
  
          choices: ['f', 'j'],
      response_start_time:1150,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image");
          data.word = jsPsych.timelineVariable("word");
          data.condition = "image_first"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,//正是实验时改为6
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   }
  
  
  
  let word_first = {
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40,//pixels 视角：0.8° x 0.8°
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1000// ms after the start of the trial
      }, 
      {
          obj_type:"image",
          file: function(){return jsPsych.timelineVariable("Image")},
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1150, // ms after the start of the trial
          show_end_time: 1200,//出现50ms
      },//上一组end时间减去下一组show时间就是空屏的100ms
      {
          obj_type: 'text',
          file: function(){return jsPsych.timelineVariable("word")},
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true);
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°, //字体和颜色设置 文字视角：3.6° x 1.6°
  
          text_color: 'white',
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1050,//出现50ms
          origin_center: true
        }
          ],
  
          choices: ['f', 'j'],
      response_start_time:1150,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image")
          data.word = jsPsych.timelineVariable("word");
          data.condition = "word_first"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,//正是实验时改为6
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   }
  
  
  
   let same = {
      timeline:[
      {
      type:jsPsychPsychophysics, 
      stimuli:[
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40, // pixels 视角：0.8° x 0.8°
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1100// ms after the start of the trial
      }, 
     {
          obj_type:"image",
          file: function(){return jsPsych.timelineVariable("Image")},
          startX: "center", // location of the cross's center in the canvas
          startY: -175, //图形和文字距离 与加号等距
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//出现50ms
          origin_center: true
      },//上一组end时间减去下一组show时间就是空屏的100ms
      {
          obj_type: 'text',
          file: function(){return jsPsych.timelineVariable("word")},
          startX: "center",
          startY: 175, //图形和文字距离 与加号等距2度
          content: function () {
            return jsPsych.timelineVariable("word", true);
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
          text_color: 'white',
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//出现50ms
          origin_center: true
        }
          ],
  
          choices: ['f', 'j'],
      response_start_time:1100,//开始作答时间，第二个刺激开始计算
      trial_duration:2650,//结束时间，一共作答时间持续1500ms
      data:function(){return jsPsych.timelineVariable("identify")},
      on_finish: function(data){
          data.correct_response = jsPsych.timelineVariable("identify", true)();
          data.correct = data.correct_response == data.key_press;//0错1对
          data.Image = jsPsych.timelineVariable("Image");
          data.word = jsPsych.timelineVariable("word");
          data.condition = "simultaneous"
      }
  },
  {
      data:{
          screen_id: "feedback_test"//这里为反馈
      },
      type:jsPsychHtmlKeyboardResponse,
      stimulus:function(){
          let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
            //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
            let time = jsPsych.data.get().last(1).values()[0].rt;
            let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
            if (time > 1500 || time === null) { //大于1500或为null为过慢
              return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
            } else if (time < 200) { //小于两百为过快反应
              return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
            } else {
              if (keypress == trial_correct_response) { //如果按键 == 正确按键
                return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
              }
              else {
                return "<span style='color:red; font-size: 70px;'>错误! </span>"
              }
            }
      },
  
      choices:"NO_KEYS",
      trial_duration:300,//300ms反馈
  }
  ],
  
      timeline_variables:[
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
  
          {Image:images[0], word:texts[1], identify:function(){return key[1]}},
          {Image:images[1], word:texts[2], identify:function(){return key[1]}},
          {Image:images[2], word:texts[0], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[2], identify:function(){return key[1]}},
          {Image:images[1], word:texts[0], identify:function(){return key[1]}},
          {Image:images[2], word:texts[1], identify:function(){return key[1]}},
  
          {Image:images[0], word:texts[0], identify:function(){return key[0]}},
          {Image:images[1], word:texts[1], identify:function(){return key[0]}},
          {Image:images[2], word:texts[2], identify:function(){return key[0]}},
      ],
      randomize_order:true,
      repetitions:1,//正是实验时改为6
      on_finish:function(){
          // $("body").css("cursor", "default"); //鼠标出现
      }
   }
  
  
  
  
  ///////block的反馈
  
  let feedback_block = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        // aaaaa = 1;  筛选，必须要！！！！！！！！！！！
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(12);// last()填入一个block里的trial总数
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                              <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
          "<p class='context'>请按任意键进入休息</p></div>";
      },
      on_finish: function () {
        // $("body").css("cursor", "default"); //鼠标出现
      }
    };
  
    let blockTotalNum_image = 0;// 此处填入总block数量-1，比如总数量是3，那么值就需要是2
    let rest_image = {
    type:jsPsychHtmlButtonResponse,
    stimulus: function () {
        let totaltrials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        );
        return `
                      <p>您当前还剩余${blockTotalNum_image}组实验</p>
                      <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                      <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
      },
      choices: ["结束休息"],
      on_load: function () {
        $("body").css("cursor", "default");
        let tmpTime = setInterval(function () {
          $("#iii").text(parseInt($("#iii").text()) - 1);
          if (parseInt($("#iii").text()) < 1) {
            $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
            clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
          }
        }, 1000);
        sessionStorage.setItem("tmpInter", tmpTime);
      },
      on_finish: function () {
        $("body").css("cursor", "none"); //鼠标消失
        blockTotalNum_image -= 1;
        $(document.body).unbind();
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }
  
  let blockTotalNum_word = 0;// 此处填入总block数量-1，比如总数量是3，那么值就需要是2
  let rest_word = {
    type:jsPsychHtmlButtonResponse,
    stimulus: function () {
        let totaltrials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        );
        return `
                      <p>您当前还剩余${blockTotalNum_word}组实验</p>
                      <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                      <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
      },
      choices: ["结束休息"],
      on_load: function () {
        $("body").css("cursor", "default");
        let tmpTime = setInterval(function () {
          $("#iii").text(parseInt($("#iii").text()) - 1);
          if (parseInt($("#iii").text()) < 1) {
            $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
            clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
          }
        }, 1000);
        sessionStorage.setItem("tmpInter", tmpTime);
      },
      on_finish: function () {
        $("body").css("cursor", "none"); //鼠标消失
        blockTotalNum_word -= 1;
        $(document.body).unbind();
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }
  
   
  
    let blockTotalNum_same = 0;// 此处填入总block数量-1，比如总数量是3，那么值就需要是2
  let rest_same = {
    type:jsPsychHtmlButtonResponse,
    stimulus: function () {
        let totaltrials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        );
        return `
                      <p>您当前还剩余${blockTotalNum_same}组实验</p>
                      <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                      <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
      },
      choices: ["结束休息"],
      on_load: function () {
        $("body").css("cursor", "default");
        let tmpTime = setInterval(function () {
          $("#iii").text(parseInt($("#iii").text()) - 1);
          if (parseInt($("#iii").text()) < 1) {
            $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
            clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
          }
        }, 1000);
        sessionStorage.setItem("tmpInter", tmpTime);
      },
      on_finish: function () {
        $("body").css("cursor", "none"); //鼠标消失
        blockTotalNum_same -= 1;
        $(document.body).unbind();
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }
  
  
  let cong_image = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>恭喜您，正式实验中的呈现顺序为先图形后文字条件已经完成。</p>
      <p> <div style = "color: green"><按任意键继续></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
    let cong_word = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>恭喜您，正式实验中的呈现顺序为先文字后图片条件已经完成。</p>
      <p> <div style = "color: green"><按任意键继续></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
    let cong_same = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>恭喜您，正式实验中的呈现顺序为图形和文字同时呈现条件已经完成。</p>
      <p> <div style = "color: green"><按任意键继续></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
  
    let p_gotoimage = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>先图形后文字条件</span>的正式匹配任务</p>
      <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
    let p_gotoword = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>先文字后图形条件</span>的正式匹配任务</p>
      <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
  
    let p_gotosame = {
      type: jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>图形和文字同时呈现条件</span>的正式匹配任务</p>
      <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
      `, 
      choices: "ALL_KEYS",
    };
  
    var repeatblock1 = [
          p_gotoimage,
          {
              timeline: [image_first, feedback_block, rest_image],
              repetitions: 1 //4个block
          },
          cong_image
      ];
  
      var repeatblock2 = [
          p_gotoword,
          {
              timeline: [word_first, feedback_block, rest_word],
              repetitions: 1
          },
          cong_word
      ];
  
      var repeatblock3 = [
          p_gotosame,
          {
              timeline: [same, feedback_block, rest_same],
              repetitions: 1
          },
          cong_same
      ];
      timeline.push({
          timeline: [{
              timeline: repeatblock1,
              conditional_function: () => {
                  return jsPsych.timelineVariable("a", true) == 1
              }
          }, {
              timeline: repeatblock2,
              conditional_function: () => {
                  return jsPsych.timelineVariable("a", true) == 2
              }
          }, {
              timeline: repeatblock3,
              conditional_function: () => {
                  return jsPsych.timelineVariable("a", true) == 3
              }
          }],
          timeline_variables: jsPsych.randomization.factorial({
              a: jsPsych.randomization.shuffleNoRepeats(
                  jsPsych.randomization.repeat([1,2,3], 1)
              )
          })
      });
  
  
  
  
  
    var finish = {
      type:jsPsychHtmlKeyboardResponse, 
      stimulus: `
      <p>感谢您参加我们的实验，请<span style="color: yellow;">按任意键开始上传数据</span>，并通知研究者。</p>
      <p>感谢您的配合！</p>`,
      choices: "ALL_KEYS",
    };
    timeline.push(finish);
  
  
  
  jsPsych.run(timeline);
  
  