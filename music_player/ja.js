const title = document.querySelector('.name');
const prev = document.querySelector('.prev');
const playpause = document.querySelector('.playpause');
const next = document.querySelector('.next');
const audio = document.querySelector('audio');
const file = document.querySelector('#file');
const picker = document.getElementById('picker');

// const songlist1 = ["./songs/[iSongs.info] 01 - Adiga Adiga.mp3", "./songs/[iSongs.info] 01 - Ay Pilla.mp3", "./songs/[iSongs.info] 01 - Chirunama Thana Chirunama.mp3", "./songs/[iSongs.info] 01 - Choosale Kallaraa.mp3", "./songs/[iSongs.info] 01 - Choti Choti Baatein.mp3", "./songs/[iSongs.info] 01 - Emito Idhi.mp3", ];
const songlist = [];
let songplaying = false;
var i = 0;

function loadsong(songlist) {
	audio.src = songlist;
}

function playsong() {
	songplaying = true;
	audio.play();
	playpause.innerHTML = '<i class="fas fa-pause"></i>';
}

function pausesong() {
	songplaying = false;
	audio.pause();
	playpause.innerHTML = '<i class="fas fa-play"></i>';
}

function prevsong() {
	i = i - 1;
	if (i < 0) {
		i = songlist.length - 1;
	}
	loadsong(songlist[i]);
	songdetails(songlist[i]);
	playsong();
}

function nextsong() {
	i = i + 1;
	if (i > songlist.length - 1) {
		i = 0;
	}
	loadsong(songlist[i]);
	songdetails(songlist[i]);
	playsong();
}

function shiftfunc(ev) {
	// left = 37
	// up = 38
	// right = 39
	// down = 40
	var key, isShift;
	if (window.event) {
		key = window.event.keyCode;
		isShift = !!window.event.shiftKey; // typecast to boolean
	} else {
		key = ev.which;
		isShift = !!ev.shiftKey;
	}
	if (isShift) {
		switch (key) {
			case 16: // ignore shift key
				break;
			default:
				if (key == 39) nextsong();
				if (key == 37) prevsong();
				break;
		}
	} else {
		switch (key) {
			case 39:
				audio.currentTime += 5;
				break;
			case 37:
				audio.currentTime -= 5;
				break;
			case 38:
				audio.volume += 0.20;
				break;
			case 40:
				audio.volume -= 0.20;
				break;
		}
	}
}

function songdetails(path) {
	ID3.loadTags(path, function () {
		showTags(path);
	}, {
		tags: ["title", "artist", "album", "picture"]
	});
}

function showTags(url) {
	var tags = ID3.getAllTags(url);
	console.log(tags);
	document.getElementById('title').textContent = tags.title || "";
	title.textContent = tags.title || "";
	document.getElementById('artist').textContent = tags.artist || "";
	document.getElementById('album').textContent = tags.album || "";
	var image = tags.picture;
	if (image) {
		var base64String = "";
		for (var i = 0; i < image.data.length; i++) {
			base64String += String.fromCharCode(image.data[i]);
		}
		var base64 = "data:" + image.format + ";base64," +
			window.btoa(base64String);
		document.getElementById('picture').setAttribute('src', base64);
	} else {
		document.getElementById('picture').style.display = "none";
	}
}

document.body.addEventListener('keydown', event => {
	if (event.keyCode == 32) {
		if (songplaying) pausesong();
		else playsong();
	}
	shiftfunc(event);
});

picker.addEventListener('change', e => {
	for (let file of Array.from(e.target.files)) {
		songlist.push(file.webkitRelativePath);
	};
	i = 0;
	loadsong(songlist[i]);
	songdetails(songlist[i]);
	picker.blur();
});

playpause.addEventListener("click", () => (songplaying ? pausesong() : playsong()));
next.addEventListener("click", nextsong);
prev.addEventListener("click", prevsong);
audio.addEventListener('ended', nextsong);