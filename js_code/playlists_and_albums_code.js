window.startFlag = true;
window.target_sp = null;
window.changedInnerTracks_flag = true;
window.looped = false;
window.changedTrackCurrentTime_flag = false;
window.audioTrack = new Audio();

function loadData_l()
{
	//загрузка плейлистов
	let list = document.querySelector(".list");

	for (let plist of mapOfPlaylists)
	{
		//создание ссылки на плейлист
		let link = document.createElement("a");
		link.setAttribute("data-num", plist[0]);
		link.append(document.createElement("span"));

		//создание имени ссылки
		let name = document.createElement("span");
		link.children[0].append(name);

		link.children[0].append(document.createElement("br"));

		//создание кол-ва композиций
		let compositions = document.createElement("span");
		link.children[0].append(compositions);

		//вставка данных ссылки
		name.innerHTML = plist[1].name;
		compositions.innerHTML = `композиций: ${plist[1].mapOfTracks.size}`;
		link.style.backgroundImage = `url(${plist[1].mapOfTracks.values().next().value.urlPicture})`;

		list.append(link);
	}

	//загрузка треков
	let innerTracks = document.querySelector(".tracks div");

	for (let track of Jointlist.jointlist.values()) innerTracks.append(track.domElem);
}

function closeTitle_l()
{
	let header = document.querySelector("header");
	let innerTracks = document.querySelector(".tracks div");

	window.startFlag = true; // flag
	opacityAnim_l([header, innerTracks], "decrease", function()
	{
		header.innerHTML = "";
		header.classList.remove("title");
		header.classList.add("list");

		innerTracks.innerHTML = "";
		window.changedInnerTracks_flag = true; //flag

		loadData_l();

		window.startFlag = true; // flag
		opacityAnim_l([header, innerTracks], "increase");
	})
}

window.startFlag = true;
function opacityAnim_l(elemarr=[], order, callback = undefined, multp = undefined)
{
	//начальные настройки анимации
	if (window.startFlag) {
		window.startTime = performance.now();
		window.startFlag = false;

		if (order === "increase") { multp = 1; for (let elem of elemarr) elem.style.opacity = 0; }
		else if (order === "decrease") { multp = -1; for (let elem of elemarr) elem.style.opacity = 1; }

		requestAnimationFrame(opacityAnim_l.bind(null, elemarr, order, callback, multp));
	}
	else if ((Number(elemarr[0].style.opacity) > 0 && order === "decrease") || (Number(elemarr[0].style.opacity) < 1 && order === "increase")) {
		//содержание анимации

		let currTime = performance.now();
		let timer = (currTime - startTime) / 10;

		//изменение значения opacity
		if (timer > 0.1) {
			for (let elem of elemarr) elem.style.opacity = Number(elem.style.opacity) + 0.1 * multp;
		}
		requestAnimationFrame(opacityAnim_l.bind(null, elemarr, order, callback, multp));
	}
	else if (callback !== undefined) {
		//console.log("load");
		return callback();
	}
}

function showTitle_l()
{
	let musicContain;
	if (event.target.parentElement === document.querySelector(".list")) musicContain = mapOfPlaylists.get(event.target.dataset.num);
	if (event.target === openAlbum) musicContain = window.target_sp.linksrc.album;

	if (event.target.parentElement === document.querySelector(".list") || event.target === openAlbum) //---
	{

		let header = document.querySelector("header");
		let innerTracks = document.querySelector(".tracks div");
		innerTracks.innerHTML = "";
		window.changedInnerTracks_flag = true; //flag

		window.startFlag = true;
		opacityAnim_l([header, innerTracks], "decrease", function() {
			header.innerHTML = "";
			header.classList.remove("list");
			header.classList.add("title");

			let figure = document.createElement("figure");
			let description = document.createElement("section")
			header.append(figure);
			header.append(description);
			
			let h1 = document.createElement("h1");
			let p = document.createElement("p");
			let compositions = document.createElement("p");
			let buttonOn = document.createElement("button");
			let buttonMess = document.createElement("button");
			let buttonExit = document.createElement("button");
			description.append(h1, p, compositions, buttonOn, buttonMess, buttonExit);

			buttonExit.addEventListener("click", closeTitle_l);

			figure.style.backgroundImage = `url(${musicContain.mapOfTracks.values().next().value.urlPicture})`;
			h1.innerHTML = musicContain.name;
			p.innerHTML = musicContain.description;
			compositions.innerHTML = "композиций: " + String(musicContain.mapOfTracks.size);
			buttonOn.innerHTML = "Включить";
			buttonMess.innerHTML = "Перемешать";
			
			for (let track of musicContain.mapOfTracks.values()) innerTracks.append(track.domElem);

			window.startFlag = true; //flag
			opacityAnim_l([header, innerTracks], "increase");
		})
	}
}

function changeLeftTrackList_l()
{
	//получение переменных
	let leftTrackList = document.querySelector(".left_track_list");
	let leftInnerTracks = document.querySelector(".left_track_list div");
	let innerTracks = document.querySelector(".tracks div");

	//положили event.target в глобальную переменную window.target_sp
	if (event.target.tagName === "A") window.target_sp = event.target;
	else if (event.target.parentElement.tagName === "A") window.target_sp = event.target.parentElement;

	turnMiniPlayerOn();

	//если список треков изменялся
	if (window.changedInnerTracks_flag)
	{
		//если в left_track_list уже есть какие-то композиции
		if (leftInnerTracks.children[0] !== null && leftInnerTracks.children[0] !== undefined)
		{
			window.startFlag = true;
			opacityAnim_l([leftInnerTracks], "decrease", func_sp)
			return "exit";
		}
		else func_sp();

		//копировать элементы из tracks в left_track_list
		function func_sp()
		{
			leftInnerTracks.innerHTML = "";
			window.changedInnerTracks_flag = false;
			leftInnerTracks.style.opacity = 0;
			leftInnerTracks.innerHTML = innerTracks.innerHTML;
			for (let i = 0; i < innerTracks.children.length; i++)
			{
				leftInnerTracks.children[i].linksrc = innerTracks.children[i].linksrc;
				if (window.target_sp.linksrc === leftInnerTracks.children[i].linksrc) window.target_sp = leftInnerTracks.children[i];
			}
			window.startFlag = true;
			opacityAnim_l([leftInnerTracks], "increase");
		}
	}
	console.log(1919);
	console.log(window.audioTrack.duration);
}
function turnMiniPlayerOn()
{
	window.audioTrack.removeEventListener("ended", turnAnotherTrackOn);
	if (!(event.target instanceof HTMLAudioElement) && !(event.target instanceof HTMLButtonElement)) 
	{
		console.log(event.target);
		window.target_sp = event.target;
		if (window.target_sp.tagName !== "A" && window.target_sp.parentElement.tagName !== "A") return "exit";
		else if (window.target_sp.parentElement.tagName === "A") window.target_sp = window.target_sp.parentElement;
	}

	//получение переменных
	let h1 = document.querySelector(".mini_player .picture h1");
	let div_sp = document.querySelector(".mini_player .picture div");
	let buttonLoop = document.querySelector(".mini_player .description .loop");
	let input = document.querySelector(".left_panel .mini_player .description input");

	window.startFlag = true;
	opacityAnim_l([h1, div_sp], "decrease", function() {
		//console.log(2);
		h1.innerHTML = "";
		h1.insertAdjacentHTML("beforeend", `${window.target_sp.linksrc.name}<br><span>${window.target_sp.linksrc.author}</span>`);
		div_sp.style.backgroundImage = `url(${window.target_sp.linksrc.urlPicture})`;

		window.startFlag = true;
		opacityAnim_l([h1, div_sp], "increase", function() {
			if (window.audioTrack !== undefined)
			{
				window.audioTrack.pause();
				window.audioTrack.src = `${window.target_sp.linksrc.urlSound}`;
				window.audioTrack.load();
			}
			window.audioTrack = new Audio(`${window.target_sp.linksrc.urlSound}`);
			
			input.setAttribute("max", Number(window.audioTrack.duration));

			window.audioTrack.play();
			window.audioTrack.addEventListener("ended", turnAnotherTrackOn);

			//запрос duration у window.audioTrack
			let findDurationOut = new Promise(function(resolve, reject)
			{
				setInterval(function() {
					if (window.audioTrack.duration !== NaN)
					{
						input.removeEventListener("click", changeTrackCurrentTimeByUser);
						window.audioTrack.removeEventListener("timeupdate", changeTrackCurrentTimeSelf);

						input.setAttribute("max", window.audioTrack.duration);
						input.addEventListener("click", changeTrackCurrentTimeByUser);
						window.audioTrack.addEventListener("timeupdate", changeTrackCurrentTimeSelf);

						resolve("done");
					}
				}, 500);
			});

			let style = document.querySelectorAll("style")[0];
			style.innerHTML = ".left_panel .mini_player .description .play {background-image: url(../icons/pause.png);} .left_panel .mini_player .description .play:hover { background-image: url(../icons/pausew.png); }";
		});
	})
}
function pausePlay() {
	if (window.audioTrack && window.audioTrack.paused) 
	{
		window.audioTrack.play();

		let style = document.querySelectorAll("style")[0];
		style.innerHTML = ".left_panel .mini_player .description .play {background-image: url(../icons/pause.png);} .left_panel .mini_player .description .play:hover { background-image: url(../icons/pausew.png); }";
	}
	else 
	{
		window.audioTrack.pause();

		let style = document.querySelectorAll("style")[0];
		style.innerHTML = ".left_panel .mini_player .description .play {background-image: url(../icons/play.png);} .left_panel .mini_player .description .play:hover { background-image: url(../icons/playw.png); }";
	}
}
function turnAnotherTrackOn()
{
	if (window.looped && (event.target instanceof HTMLAudioElement))
	{
		turnMiniPlayerOn();
	}
	else if (window.target_sp.previousElementSibling && event.target === document.querySelector(".mini_player .back"))
	{
		window.target_sp = window.target_sp.previousElementSibling;
		turnMiniPlayerOn();
	}
	else if (window.target_sp.nextElementSibling && event.target === document.querySelector(".mini_player .forward") || (event.target instanceof HTMLAudioElement))
	{
		window.target_sp = window.target_sp.nextElementSibling;
		turnMiniPlayerOn();
	}
}
function makeItLooping()
{
	let style = document.querySelectorAll("style")[1];
	if (!window.looped) 
	{
		window.looped = true;
		style.innerHTML = ".left_panel .mini_player .description .loop { background-image: url(../icons/loopw.png); border-color: white; }";
	}
	else 
	{
		window.looped = false;
		style.innerHTML = "";
	}
}
function changeTrackCurrentTimeByUser()
{
	let input = document.querySelector(".left_panel .mini_player .description input");
	window_changedTrackCurrentTime_flag = true;
	window.audioTrack.currentTime = Number(input.value);

	console.log("i changed");
}
function changeTrackCurrentTimeSelf()
{
	if (!window.changedTrackCurrentTime_flag)
	{
		let input = document.querySelector(".left_panel .mini_player .description input");
		input.setAttribute("value", window.audioTrack.currentTime);
	}
	window_changedTrackCurrentTime_flag = false;
}
function turnMainPlayerOn()
{

}

loadData_l();
let header = document.querySelector("header");
header.addEventListener("click", showTitle_l);

let openAlbum = document.querySelector(".menu .openAlbum");
openAlbum.addEventListener("click", showTitle_l);

let innerTracks = document.querySelector(".tracks div");
innerTracks.addEventListener("click", changeLeftTrackList_l);

let leftInnerTracks = document.querySelector(".left_track_list div");
leftInnerTracks.addEventListener("click", turnMiniPlayerOn);

let buttonPlayPause = document.querySelector(".left_panel .mini_player .description .play");
buttonPlayPause.addEventListener("click", pausePlay);

let buttonForward = document.querySelector(".mini_player .forward");
buttonForward.addEventListener("click", turnAnotherTrackOn);

let buttonBack = document.querySelector(".mini_player .back");
buttonBack.addEventListener("click", turnAnotherTrackOn);

let buttonLoop = document.querySelector(".mini_player .loop");
buttonLoop.addEventListener("click", makeItLooping);

function test120()
{
	alert("what!");
	console.log(1111);
}