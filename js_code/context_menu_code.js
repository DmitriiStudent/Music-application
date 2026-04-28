const mini_track_list = document.querySelector(".left_panel .left_track_list");
const main_track_list = document.querySelector(".tracks");
const menu = document.querySelector(".menu");

function openMenu()
{
	if (event.target !== mini_track_list && event.target !== main_track_list && event.target.tagName !== "P")
	{
		if (event.target.tagName === "A") window.target_sp = event.target;
		else if (event.target.tagName === "SPAN") window.target_sp = event.target.parentElement;

		event.preventDefault();
		
		menu.style.display = "block";
		menu.style.left = `${event.clientX}px`;
		menu.style.top = `${event.clientY}px`;
	}
}

mini_track_list.addEventListener("contextmenu", openMenu);
main_track_list.addEventListener("contextmenu", openMenu);

function closeMenu()
{
	if (event.button != 2) { menu.style.display = "none"; }
}

document.addEventListener("click", closeMenu);
document.addEventListener("click", closeMenu);

function fixFunc() { event.preventDefault(); event.stopPropagation(); }

menu.addEventListener("click", fixFunc);