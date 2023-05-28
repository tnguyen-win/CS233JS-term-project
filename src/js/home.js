/* jshint esversion: 6 */
import "./init";

class Home {
	constructor() {
		this.$submit = document.getElementById("btnSubmit");
		this.$form = document.getElementById("inputURL");
		this.$content = document.getElementById("divContent");
		this.release = [{
			date: "%DATE%",
			authorImg: "https://avatars.githubusercontent.com/u/9919?s=40&v=4",
			authorBody: "%AUTHOR%",
			release: "%RELEASE%",
			commit: "%COMMIT%",
			title: "%TITLE%",
			latest: true ? "" : "d-none ",
			changelog: "%CHANGELOG%",
			downloadableLength: 0,
			downloadableBody: "%DOWNLOADABLE BODY%",
			reactionsBody: "%REACTIONS BODY%",
			reactionsLength: 0,
		},];

		this.addEventListeners();
	}

	addEventListeners() {
		this.$submit.onclick = e => {
			e.preventDefault();

			this.onSubmit();
		};
	}

	onSubmit() {
		this.drawHTML(this.release[0]);
	}

	drawHTML() {
		this.$content.classList.remove("d-none");

		fetch(`${window.location}components/release.html`)
			.then((res) => res.ok ? res.text() : (() => { throw new Error(res.status); })())
			.then(html => {
				for (let r in this.release[0]) html = r !== "authorImg" ? html.replace(`r.${r}`, this.release[0][r]) : html.replace('src=""', `src="${this.release[0].authorImg}"`);

				this.$content.innerHTML = html;
			})
			.catch(err => console.log(`FETCH ERROR: ${err}`));

	}
}

window.onload = () => new Home();