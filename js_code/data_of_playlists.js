class Jointlist
{
	static jointlist = new Map();

	static find(trackname)
	{
		return Jointlist.jointlist.get(trackname);
	}
}

class Playlist extends Jointlist
{
	constructor(title, descr, tracks = new Map())
	{
		super();
		this.name = title;
		this.description = descr;
		this.mapOfTracks = tracks;
	}
	push(track)
	{
		this.mapOfTracks.set(track.name, track);
	}
};
class Album extends Playlist
{
	constructor(title, athr, descr, addressPicture, tracks = new Map())
	{
		super(title, descr, tracks);
		this.author = athr;
		this.urlPicture = addressPicture;
		
		for (let track of tracks)
		{
			track.album = this;
			track.urlPicture = this.urlPicture;

			Jointlist.jointlist.set(track.name, track);
		}
	}
	push(track)
	{
		track.album = this;
		track.urlPicture = this.urlPicture;
		track.author = this.author;
		track.domElem.style.backgroundImage = `url(${this.urlPicture})`;
		this.mapOfTracks.set(track.name, track);
		Jointlist.jointlist.set(track.name, track);
	}
}
class Track
{
	constructor(title, athr, addressSound, addressPicture)
	{
		this.name = title;
		this.author = athr;
		this.urlSound = addressSound;
		this.urlPicture = addressPicture;
		this.album = new Album(title, "", addressPicture, new Map().set(this.name, this));

		this.domElem = document.createElement("a");
		this.domElem.append(document.createElement("span"), document.createElement("span"), document.createElement("span"));
		this.domElem.children[0].innerHTML = title;
		this.domElem.children[1].innerHTML = athr;
		this.domElem.children[2].innerHTML = this.album.name;
		this.domElem.linksrc = this;
	}
};


//создание плейлистов
let mapOfPlaylists = new Map();
mapOfPlaylists.set("1", new Playlist("Грустная музыка", "Просто грустная музыка"));
mapOfPlaylists.set("2", new Playlist("Светлая музыка", "Утро утро утро"));
mapOfPlaylists.set("3", new Playlist("Ожидание весны", "Пойдём в этот теплый май"));
//mapOfPlaylists.set("4", new Playlist("Лето", "Тихий ветер"));

//создание альбомов
let mapOfAlbums = new Map();
mapOfAlbums.set("Paper thin reality", new Album("Paper thin reality", "1000 Handz", "", "../music/pictures/Peculiar.jpg"));
mapOfAlbums.get("Paper thin reality").push(new Track("Peculiar", "1000 Handz, Free Music Archive, CC BY", "../music/1000 Handz - Peculiar.mp3"));

mapOfAlbums.set("Descend into self", new Album("Descend into self", "Elijah_K", "", "../music/pictures/DeepBlue.jpg"));
mapOfAlbums.get("Descend into self").push(new Track("Medusa", "Elijah_K, Free Music Archive, CC BY", "../music/Elijah_K - Medusa.mp3"));

mapOfAlbums.set("The sameness of phosphorus and hesperus", new Album("The sameness of phosphorus and hesperus", "Elijah_K", "", "../music/pictures/Medusa.jpg"));
mapOfAlbums.get("The sameness of phosphorus and hesperus").push(new Track("Deep Blue", "Elijah_K, Free Music Archive, CC BY", "../music/Elijah_K - Deep Blue.mp3"));

//кладём композиции в плейлисты
mapOfPlaylists.get("1").push(Jointlist.find("Medusa"));

mapOfPlaylists.get("2").push(Jointlist.find("Medusa"));
mapOfPlaylists.get("2").push(Jointlist.find("Deep Blue"));

mapOfPlaylists.get("3").push(Jointlist.find("Peculiar"));
mapOfPlaylists.get("3").push(Jointlist.find("Medusa"));

//mapOfPlaylists.get("4").push(Jointlist.find("Deep Blue"));