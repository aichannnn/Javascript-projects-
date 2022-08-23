const container = document.querySelector(".container"),
mainVideo = container.querySelector("video"),
videoTimeLine = container.querySelector(".video-timeline")
progressBar = container.querySelector(".progress-bar")
volumeSlider = container.querySelector(".left input")
currentVidTime = container.querySelector(".current-time")
vidDuration = container.querySelector(".video-duration")
volumeBtn = container.querySelector(".volume i")
skipBackword = container.querySelector(".skip-backword i");
skipForword = container.querySelector(".skip-forword i");
playPauseBtn = container.querySelector(".play-pause i");
speedBtn = container.querySelector(".playback-speed span");
speedOption = container.querySelector(".speed-option ");
picInPicBtn = container.querySelector(".pic-in-pic ");
fullscreenBtn = container.querySelector(".fullscreen i");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return; //if video is paused return
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    },3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls")
    clearTimeout(timer);
    hideControls();
})


const formatTime = time =>{
    //getting seconds, minutes, hours
    let seconds = Math.floor(time % 60),
    minutes = Math.floor(time / 60) %60,
    hours = Math.floor(time / 3600);

     //adding 0 at the begining i the particular value is less than 10
    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) { //if hours is 0 return minutes & seconds only else return all
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;

}

mainVideo.addEventListener("timeupdate", e => {
    let { currentTime, duration } = e.target; //getting current time and duration of the video
    let percent = (currentTime / duration)* 100 //getting perentage 
    progressBar.style.width = `${percent}%`; //passing percent as progressbar width
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener('loadeddata', e => {
    vidDuration.innerText = formatTime(e.target.duration); //passing duration as vidDuration innertext
})

videoTimeLine.addEventListener("click", e=> {
    let timelineWidth = videoTimeLine.clientWidth; //getting video timeline width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating videos timeline
});

const draggableProgressBar = e =>{
    let timelineWidth = videoTimeLine.clientWidth; //getting video timeline width
    progressBar.style.width = `${e.offsetX}px`; //passing offsetx value as a progressbar width
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration; // updating videos timeline
    currentVidTime.innerText = formatTime(mainVideo.currentTime); //passing video current time as currentvidtime innertext
}

videoTimeLine.addEventListener('mousedown', () => { //calling draggableProgress function on mousemove event
    videoTimeLine.addEventListener('mousemove', draggableProgressBar);
})

container.addEventListener('mouseup', () => { //removing mousemove listener on mouseup event
    videoTimeLine.removeEventListener('mousemove', draggableProgressBar);
})

videoTimeLine.addEventListener("mousemove", e => {
    const progressTime = videoTimeLine.querySelector('span');
    let offsetX = e.offsetX; //getting mouseX position
    progressTime.style.left=`${offsetX}px` //passing offsetX value as a progress time left value
    let timelineWidth = videoTimeLine.clientWidth; 
    let percent =  (e.offsetX / timelineWidth) * mainVideo.duration; //getting percent
    progressTime.innerText = formatTime(percent); //passing percent as a progress time 
})

volumeBtn.addEventListener("click", () => {
    if(volumeBtn.classList.contains("fa-volume-high")) { //if volume icon isn't volume high icon
        mainVideo.volume =0.5; //passing 0.5 value as video volume
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    } else{
        mainVideo.volume =0.0; //passing 0.0 value as video volume, so the video mute
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
    volumeSlider.value = mainVideo.volume   //update slider value according to the video volume
 });

volumeSlider.addEventListener("input", e => {
    mainVideo.volume = e.target.value; //passing slider value as video
    if(e.target.value ==0){   //if slider value as video volume
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }else{
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }
});

speedBtn.addEventListener("click", () => {
    speedOption.classList.toggle("show");  //toggle show class
});

speedOption.querySelectorAll("li").forEach(option => {
    option.addEventListener("click", () =>{  // adding click event on all speed option
        mainVideo.playbackRate = option.dataset.speed; //passing option dataset value as video playback value
        speedOption.querySelector(".active").classList.remove("active"); //removing active class
        option.classList.add("active"); //adding active class on the selected option

    });    
});

document.addEventListener("click", e => {  //hide speed option on document click
    if(e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {
        speedOption.classList.remove("show");
    }
});

picInPicBtn.addEventListener("click", () => {
    mainVideo.requestPictureInPicture();  //changing video mode to picture in picture 

})

fullscreenBtn.addEventListener("click", () => {
    container.classList.toggle("fullscreen"); //toggle fullscreen class
    if(document.fullscreenElement) { //if video is already in fullscreen mode
        fullscreenBtn.classList.replace("fa-Compress", "fa-expand");
        return document.exitFullscreen(); //exit from fullscreen mode and return
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress");
    container.requestFullscreen(); //go to fullscreen mode
})

skipBackword.addEventListener("click", () => {
    mainVideo.currentTime -=5; //subract 5 second from the current video time
});

skipForword.addEventListener("click", () => {
    mainVideo.currentTime +=5; //add 10 second to the current video time
})


playPauseBtn.addEventListener("click", () => {
    // if video is paused play the video else pause the video
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
});

mainVideo.addEventListener("play", () => {    // if video is play,change icon to pause
    playPauseBtn.classList.replace("fa-play", "fa-pause");
});

mainVideo.addEventListener("pause", () => {  // if video is pauseq,change icon to pause
    playPauseBtn.classList.replace("fa-pause", "fa-play");
});

