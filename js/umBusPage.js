// ----- common function
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
function datetimeAnalysis(datetime){
    let regexp = /[0-9]+/g
    return datetime.match(regexp)
}
// ----- library function

// 格局化日期：yyyy-MM-dd
function formatDate(paramDate) {
    var date = new Date()
    date.setTime(paramDate)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    return (year + '-' + month + '-' + day)
  }
function getPreWeek() {
    let dateStr = getTimeData()[1]
    var preWeek = setWeekDate(dateStr, -7, false)
    preWeek = formatDate(preWeek)
    return preWeek
}
function setWeekDate(dateStr, interval, isPre) {
    var arr = dateStr.split('-') // 獲取當前日期的年份，月份，日期
    var date = new Date(arr[0], arr[1] - 1, arr[2])
    date.setDate(date.getDate() + interval)
    // 一周中的第几天[0, 6]，星期天是0
    var week = (date.getDay() || 7) - 1
    // 减去 offset，获取第一天
    var offset = ''
    if (isPre) {
        offset = week * -1
    } else {
        offset = 6 - week
    }
    date.setDate(date.getDate() + offset)
    return new Date(date)
}

// ----- use function

function getBusApiData(date_from,date_to,status){
    return $.ajax({
      type: "GET",
      url: `https://api.data.um.edu.mo/service/facilities/shuttle_bus_arrival_time/v1.0.0/all?date_from=${encodeURIComponent(date_from)}&date_to=${encodeURIComponent(date_to)}`,
      headers: {
        Authorization: 'Bearer d779c193-af98-386d-9793-119409c66b1a',
        Accept: 'application/json'
      },
      success: function(data) {
        // ststus 1 for get the latest api data
        if(status == 1){
            if(data._embedded[0]){
                let datetime_use = datetimeAnalysis(data._embedded[0].datetime)
                document.getElementById("latest_bus_message").innerText = `校巴最近在${datetime_use[3]}時${datetime_use[4]}分${datetime_use[5]}秒抵達${data._embedded[0].station}巴士站`
            }
        }else if(status == 2){
            console.log(data._embedded)
        }
      }
    })
  }

// ----- main function
function getCurrentTimeLine(bus_timetable){
    let d = new Date()
    let hour = d.getHours() * 3600
    let minute = d.getMinutes() * 60
    let second = d.getSeconds()
    let day = d.getDay() 
    let all_count = hour + minute + second
    if(day > 0 && day < 6){
        return compareTimeline(all_count,bus_timetable[0].general.time_line)
    }else if(day == 6){
        return compareTimeline(all_count,bus_timetable[0].saturday.time_line)
    }else if(day == 0){
        return compareTimeline(all_count,bus_timetable[1].public_holiday.time_line)
    }
}
// use timeline and the current all time to sec compare
function compareTimeline(count_time,time_line){
    var result
    time_line.forEach(e => {
        count_time_from = (e.time_from[0] * 3600) + (e.time_from[1] * 60) + e.time_from[2]
        count_time_to = (e.time_to[0] * 3600) + (e.time_to[1] * 60) + e.time_to[2]
        if(count_time >= count_time_from && count_time < count_time_to){
            count_time_different = (count_time - count_time_from) % (e.time_interlaced * 60)
            var small_time_line = {
                'time_from': [parseInt((count_time - count_time_different) / 3600),parseInt((count_time - count_time_different) % 3600 / 60),(count_time - count_time_different) % 3600 % 60],
                'time_to': [parseInt((count_time - count_time_different + (e.time_interlaced * 60 )) / 3600),parseInt((count_time - count_time_different + (e.time_interlaced * 60)) % 3600 / 60),(count_time - count_time_different + (e.time_interlaced * 60)) % 3600 % 60]
            }
            e.small_time_line = small_time_line
            result = e
        }
    })
    return result
}
function predictBusStation(currentTimeline){
    // get current time line api
    getBusApiData(`${getTimeData()[1]}T${addZero(currentTimeline.small_time_line.time_from[0])}:${addZero(currentTimeline.small_time_line.time_from[1])}:00+08:00`,getTimeData()[0],2)
    // get last week time line api
    getBusApiData(`${getPreWeek()}T${addZero(currentTimeline.small_time_line.time_from[0])}:${addZero(currentTimeline.small_time_line.time_from[1])}:00+08:00`,`${getPreWeek()}T${addZero(currentTimeline.small_time_line.time_to[0])}:${addZero(currentTimeline.small_time_line.time_to[1])}:00+08:00`,2)
    
}

// def value
var um_location = ["研究生宿舍PGH","劉少榮樓E4","大學會堂N2","行政樓N6","科技學院E11","人民社科樓E21","法學院E32","薈萃坊S4"]
var um_location_api = ["研究生宿舍","劉少榮樓","大學會堂","行政樓","FST","FSS","FLL","薈萃坊"]
var bus_timetable = [
    school_day = {
      general:{
        time_line:[
          {
            time_from:[7,30,00],
            time_to:[8,30,00],
            time_interlaced:15
          },
          {
            time_from:[8,30,00],
            time_to:[10,00,00],
            time_interlaced:10
          },
          {
            time_from:[10,00,00],
            time_to:[12,00,00],
            time_interlaced:15
          },
          {
            time_from:[12,00,00],
            time_to:[15,00,00],
            time_interlaced:10,
          },
          {
            time_from:[15,00,00],
            time_to:[17,00,00],
            time_interlaced:15
          },
          {
            time_from:[17,00,00],
            time_to:[19,00,00],
            time_interlaced:10
          },
          {
            time_from:[19,00,00],
            time_to:[23,15,00],
            time_interlaced:15
          },
        ]
      },
      saturday:{
        time_line:[
          {
            time_from:[7,30,00],
            time_to:[23,15,00],
            time_interlaced:15
          }
        ]
      },
      public_holiday:{
        time_line:[
          {
            time_from:[10,00,00],
            time_to:[17,45,00],
            time_interlaced:15
          },
        ]
      }
    },
    day_off = {
      genreal:{
        time_line:[
          {
            time_from:[8,00,00],
            time_to:[19,45,00],
            time_interlaced:15
          }
        ]
      },
      public_holiday:{
        time_line:[
          {
            time_from:[10,00,00],
            time_to:[17,45,00],
            time_interlaced:15
          }
        ]
      }
    }
]
var currentTimeline = getCurrentTimeLine(bus_timetable)
// main
clickShowBox("#current_bus_section",".close_current_bus_btn",".show_current_bus_bg","#current_bus_content")
if(currentTimeline != null){
  // for the latest bus open message
  document.getElementById("latest_bus_open_message").innerText = `下一班車會在${currentTimeline.small_time_line.time_to[0]}時${currentTimeline.small_time_line.time_to[1]}分在研究生宿舍巴士站出發`
  // for the latest bus message
  getBusApiData(`${getTimeData()[1]}T${addZero(currentTimeline.small_time_line.time_from[0])}:${addZero(currentTimeline.small_time_line.time_from[1])}:00+08:00`,getTimeData()[0],1)
  console.log(currentTimeline)
  
  predictBusStation(currentTimeline)
  console.log(getPreWeek())
}else{
  document.getElementById("latest_bus_open_message").innerText = "現在不是校巴服務時間"
  document.getElementById("latest_bus_message").style.display = "none"
  document.getElementById("bus_current_station").innerText = "現在不是校巴服務時間"
  document.getElementById("bus_next_station").innerText = "現在不是校巴服務時間"
}