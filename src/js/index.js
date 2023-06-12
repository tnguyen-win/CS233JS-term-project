/* jshint esversion: 6 */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "../css/styles.css";

class Home {
	constructor() {
		this.$formOwner = document.getElementById("inputOwner");
		this.$formRepo = document.getElementById("inputRepo");
		this.$content = document.getElementById("divContent");
		this.$submit = document.getElementById("btnSubmit");

		this.addEventListeners();
	}

	addEventListeners() {
		this.$submit.onclick = e => {
			e.preventDefault();

			this.fetchData();
		};
	}

	fetchData() {
		let h;

		fetch(`https://api.github.com/repos/${this.$formOwner.value}/${this.$formRepo.value}/releases`)
			.then((resAPI) => resAPI.ok ? resAPI.text() : (() => { throw new Error(resAPI.status); })())
			.then(fetchedAPI => {
				fetch(`${window.location}components/release.html`)
					.then((resHTML) => resHTML.ok ? resHTML.text() : (() => { throw new Error(resHTML.status); })())
					.then(fetchedHTML => {
						this.$content.innerHTML = "";

						JSON.parse(fetchedAPI).forEach((r, i) => {
							h = fetchedHTML;

							this.injectHTML(r, h, i);
						});
					})
					.catch(errHTML => this.errorWarnings(errHTML));
			})
			.catch(errAPI => this.errorWarnings(errAPI));
	}

	errorWarnings(err) {
		const warning = "One or more errors accorded - make sure your spelling is correct. Check the console for further details.";

		this.$content.innerHTML = `
		<div class="text-center text-danger">
			<h1>FAILED FETCH</h1>
			<h3>${warning}</h3>
		</div>
		`;

		alert(warning);

		console.log(`FETCH ERROR: ${err}`);
	}

	injectHTML(r, h, i) {
		const c = new showdown.Converter();
		let templateSource = `<a href="${r.zipball_url}"> Source code(zip)</a><br /><a href="${r.tarball_url}">Source code(tar.gz)</a>`;
		let placeholders = {
			"date": `${this.getElapsedTime(r)}`,
			"authorIMG": r.author.avatar_url,
			"authorBody": r.author.login,
			"tagLink": `https://github.com/${this.$formOwner.value}/${this.$formRepo.value}/tree/${r.tag_name}`,
			"tagBody": r.tag_name,
			"titleLink": r.html_url,
			"titleBody": r.tag_name,
			"latestClass": i === 0 ? "" : " d-none",
			"latestLink": `https://github.com/${this.$formOwner.value}/${this.$formRepo.value}/releases/latest`,
			"changelog": c.makeHtml(r.body),
			"assetsAttribute": i === 0 ? "open" : "",
			"downloadableLength": r.assets.length + 2,
			"downloadableBody": r.assets.length > 0 ? `${r.assets.map(a => `<a href="${a.browser_download_url}">${a.name}</a>`).join("<br />")}<br/>${templateSource}` : `${templateSource}`,
		};

		Object.keys(placeholders).forEach(s => h = h.includes(`r.${s}`) ? h.replaceAll(`r.${s}`, placeholders[s]) : h);

		this.$content.innerHTML += h;
	}

	getElapsedTime(r) {
		let d1 = new Date(r.created_at);
		let d2 = new Date();
		let d3 = d1.toDateString().split(" ");

		// Source for date diff algorithms - https://javascript.plainenglish.io/find-difference-between-dates-in-javascript-80d9280d8598

		return this.yearsDiff(d1, d2) > 0 ? `${d3[1]} ${d3[2]}, ${d3[3]} ` :
			this.monthsDiff(d1, d2) > 0 ? `${d3[1]} ${d3[2]} ` :
				this.weeksDiff(d1, d2) > 0 ? `${this.weeksDiff(d1, d2)} weeks ago` :
					this.daysDiff(d1, d2) > 0 ? `${this.daysDiff(d1, d2)} days ago` :
						this.hoursDiff(d1, d2) > 0 ? `${this.hours(d1, d2)} hours ago` :
							this.minutesDiff(d1, d2) > 0 ? `${this.minutesDiff(d1, d2)} minutes ago` :
								this.secondsDiff(d1, d2) > 0 ? `${this.secondsDiff(d1, d2)} seconds ago` : "";
	}

	monthsDiff(d1, d2) {
		let date1 = new Date(d1);
		let date2 = new Date(d2);
		let years = this.yearsDiff(d1, d2); let months = (years * 12) + (date2.getMonth() - date1.getUTCMonth());

		return months;
	}

	yearsDiff(d1, d2) {
		let date1 = new Date(d1);
		let date2 = new Date(d2);
		let yearsDiff = date2.getFullYear() - date1.getFullYear();

		return yearsDiff;
	}

	weeksDiff(d1, d2) {
		let days = this.daysDiff(d1, d2);
		let weeksDiff = Math.floor(days / 7);

		return weeksDiff;
	}

	daysDiff(d1, d2) {
		let hours = this.hoursDiff(d1, d2);
		let daysDiff = Math.floor(hours / 24);

		return daysDiff;
	}

	hoursDiff(d1, d2) {
		let minutes = this.minutesDiff(d1, d2);
		let hoursDiff = Math.floor(minutes / 60);

		return hoursDiff;
	}

	minutesDiff(d1, d2) {
		let seconds = this.secondsDiff(d1, d2);
		let minutesDiff = Math.floor(seconds / 60);

		return minutesDiff;
	}

	secondsDiff(d1, d2) {
		let secDiff = Math.floor((d2 - d1) / 1000);

		return secDiff;
	}
}

window.onload = () => new Home();