// ---- function for full screen ----
  /* Get the documentElement (<html>) to display the page in fullscreen */
  var elem = document.documentElement;
  /* View in fullscreen */
  function openFullscreen() {
    if (elem.requestFullscreen) {
      elem.requestFullscreen() 
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
    document.querySelector("#fullscreen_btn").style.display = "none"
    document.querySelector("#closeFullscreen_btn").style.display = "block"
  }
  /* Close fullscreen */
  function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
    document.querySelector("#fullscreen_btn").style.display = "block"
    document.querySelector("#closeFullscreen_btn").style.display = "none"
  }
  // for fullscreen button
  document.querySelector("#fullscreen_btn").addEventListener("click", function(e) {
    openFullscreen()
  });
  document.querySelector("#closeFullscreen_btn").addEventListener("click", function(e) {
    closeFullscreen()
});


    // \n\t(2)新增飯堂討論區介面🤝\
    // \n\t(3)新增更多書院飯堂選項🍔\
    // \n\t(4)澳大校巴報站更新V0.31🚌\
    // \n\t(5)新增澳門來往澳大巴士🗃️\
    // \n\t(6)新增預計校巴等候時間🚃\

// ---- for alert information ----
  function alertInfo(){
    alert("Uminfo.tech V0.22版本更新🎲\
    \n\t最後更新日期：2021年1月16日🔥\
    \n\t(1)巴士報站：繁忙時段＝》不間斷行駛🔥\
    \n\n-----作者的話-----\
    \n希望大家在2021都身體健康🎉🎉\
    \n大家期待下次更新吧👻\nBy Ray👨🏼‍💻\n")
  }
  document.querySelector("#alert_info").addEventListener("click", function(e) {
    alertInfo()
  });

// ---- for click show box ----
  function clickShowBox(show_btn,close_btn,content_bg,show_box){
    // show_btn = click the button to show the box
    // close_btn = click the button to close the box
    // show_box = show the content box
    document.querySelector(show_btn).addEventListener("click", function(e) {
      document.querySelector(show_box).style.display = "flex"
      document.querySelector("body").style.overflow = "hidden"
    })
    document.querySelector(content_bg).addEventListener("click", function(e) {
      document.querySelector(show_box).style.display = "none"
      document.querySelector("body").style.overflow = "scroll"
    })
    document.querySelector(close_btn).addEventListener("click", function(e) {
      document.querySelector(show_box).style.display = "none"
      document.querySelector("body").style.overflow = "scroll"
    })
  }

// teaching use demo 

{/* 
<div id="current_bus_content" class="showContent">
  <section>
    <div class="close_content_btn close_current_bus_btn">
        <span></span>
        <span></span>
    </div>
    <div class="flex">
        
    </div>
  </section>
  <div class="show_content_bg show_current_bus_bg"></div>
</div> 
*/}

// js call that
{/* 

  clickShowBox("#current_bus_section",".close_current_bus_btn",".show_current_bus_bg","#current_bus_content")

*/}