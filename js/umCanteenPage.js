// --------------- common function
function addZero(number){
  if(number < 10){
    let result = '0'+number
    return result
  }
    return number
}

function getDelayTime(delay_time){
  let d = new Date()
  let hour = d.getHours() * 3600
  let minute = d.getMinutes() * 60
  let second = d.getSeconds()

  let all_count = hour + minute + second
  all_count = all_count - delay_time
  hour = Math.floor(all_count / 3600)      
  minute = Math.floor(all_count % 3600 / 60)
  second = all_count % 3600 % 60
  if( hour < 0 || minute < 0 || second < 0){
    return [d.getHours(),d.getMinutes(),d.getSeconds()]
  }else{
    return [hour,minute,second]
  }
}

function getTimeData(delay_time){
  let d = new Date()
  let date = addZero(d.getDate())
  let year = d.getFullYear()
  let month = addZero(d.getMonth()+1)
  let hours = addZero(d.getHours())
  let minutes = addZero(d.getMinutes())
  let seconds = addZero(d.getSeconds()) 
  // full now current time
  let full_time = `${year}-${month}-${date}T${hours}:${minutes}:${seconds}+08:00`
  let full_date = `${year}-${month}-${date}`
  if(delay_time){
      let full_delay_time = `${year}-${month}-${date}T${addZero(getDelayTime(delay_time)[0])}:${addZero(getDelayTime(delay_time)[1])}:${addZero(getDelayTime(delay_time)[2])}+08:00`
      return [full_time,full_date,full_delay_time]
  }else{
      return [full_time,full_date]
  }
}

// --------------- use function
function getApiData(current_college,date_from,date_to,status){
  return $.ajax({
    type: "GET",
    url: `https://api.data.um.edu.mo/service/student/student_meal_consumption/v1.0.0/all?consumption_location=${current_college}&consume_date_from=${encodeURIComponent(date_from)}&consume_date_to=${encodeURIComponent(date_to)}&sort_by=-consumeTime`,
    headers: {
      Authorization: 'Bearer dc441188-d713-3496-976c-953bda5520cd',
      Accept: 'application/json'
    },
    success: function(data) {
      if(status == 1){
        count_day_total_number += data._embedded.length
        document.getElementById("count_day_number").innerText = count_day_total_number
      }
      if(status == 2){
        min_current_number = data._embedded.length
        if(min_current_number > 80){
          document.querySelector("#queue_status").innerText = '人滿為患'
        }else if(min_current_number > 60){
          document.querySelector("#queue_status").innerText = '人山人海'
        }else if(min_current_number > 30){
          document.querySelector("#queue_status").innerText = '濟濟一堂'
        }else if(min_current_number > 0){
          document.querySelector("#queue_status").innerText = '寥寥無幾'
        }else if(min_current_number == 0){
          document.querySelector("#queue_status").innerText = '空無一人'
        }
      }
      if(status == 3){
        max_current_number = data._embedded.length
      }
      // all status
      if(max_current_number != 0 || min_current_number != 0){
        document.getElementById("current_number_range").innerText = `${min_current_number} - ${max_current_number}`
      }
      
      if(data._embedded.length == 100){
        console.log("數據可能不準確")
      }
    }
  })
}
// --------------- main function
function preTimeApiFunciton(status_code,current_college,hour_form,minute_form,hour_to,minute_to){
  prepare_time = [`${getTimeData()[1]}T${addZero(hour_form)}:${addZero(minute_form)}:00+08:00`,`${getTimeData()[1]}T${addZero(hour_to)}:${addZero(minute_to)}:00+08:00`]
  getApiData(current_college,prepare_time[0],prepare_time[1],status_code)
}
function checkCollege(){
  if(localStorage['current_college']){
    document.querySelector("#select_college").value = localStorage['current_college']
    return localStorage['current_college']
  }
}
function selectCollege(college){
  localStorage['current_college'] = college
  current_college = college
  countDayTotalNumber(current_college)
  countCurrentNumber(current_college)
}

function countDayTotalNumber(current_college){
  count_day_total_number = 0
  //breakfast 07:30 - 10:00
  this.preTimeApiFunciton(1,current_college,7,15,8,30)
  this.preTimeApiFunciton(1,current_college,8,30,9,30)
  this.preTimeApiFunciton(1,current_college,9,30,10,0)
  //lunch 11:30 - 14:30
  this.preTimeApiFunciton(1,current_college,11,30,12,0)
  this.preTimeApiFunciton(1,current_college,12,0,12,20)
  this.preTimeApiFunciton(1,current_college,12,20,12,45)
  this.preTimeApiFunciton(1,current_college,13,0,13,30)
  this.preTimeApiFunciton(1,current_college,13,30,14,30)
  //dinner 17:30 - 20:30
  this.preTimeApiFunciton(1,current_college,17,30,18,15)
  this.preTimeApiFunciton(1,current_college,18,15,19,0)
  this.preTimeApiFunciton(1,current_college,19,0,20,0)
  this.preTimeApiFunciton(1,current_college,20,0,20,40)
}

function countCurrentNumber(){
  min_current_number = 0
  max_current_number = 0
  this.preTimeApiFunciton(2,current_college,getDelayTime(0)[0],getDelayTime(0)[1],getDelayTime(1800)[0],getDelayTime(1800)[1])
  this.preTimeApiFunciton(3,current_college,getDelayTime(0)[0],getDelayTime(0)[1],getDelayTime(3000)[0],getDelayTime(3000)[1])

}

// --------------- main use
// def value
var count_day_total_number = 0
var min_current_number = 0
var max_current_number = 0

var current_college = checkCollege()
// main function
clickShowBox(".forum_section",".close_forum_btn",".show_forum_bg","#forum_content")
clickShowBox("#menu_section",".close_menu_btn",".show_menu_bg","#menu_content")

countDayTotalNumber(current_college)
countCurrentNumber(current_college)

