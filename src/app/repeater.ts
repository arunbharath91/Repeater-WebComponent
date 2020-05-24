/************************************************Reapter v_1.0*********************************************************/
class NgRepeat extends HTMLElement {
  protected connectedCallback() {
    if (this.getAttribute('shadow') != "false") {
      this.attachShadow({ mode: 'open' });
    }
    this.render();
  }

  private render() {
    const contentPromise = fetch(this.getAttribute('content') as string);
    let template = this.innerHTML;
    const elemRef = this;
    elemRef.innerHTML = `<img src="assets/images/skeleton.gif" />`
    contentPromise.then((res) => {
      return res.json();
    }).then((data) => {
      let html = '';
      if (Array.isArray(data)) {
        data.forEach((item) => {
          html += this.interpolate(template, item);
        });
      } else {
        throw new Error("Content should be an Array of objects.");
      }

      if (elemRef.getAttribute('shadow') != "false") {
        (elemRef.shadowRoot as ShadowRoot).innerHTML = html;
        elemRef.innerHTML = "";
      } else {
        elemRef.innerHTML = html;
      }

    }).catch((err) => {
      console.log(err);
    });
  }
  protected attributeChangedCallback(name: any) {
    switch (name) {
      case "content":
        this.render();
        break;
    }
  }

  private interpolate(template: string, obj: { [x: string]: any; }) {
    if (typeof obj == "object") {
      for (let key in obj) {
        const find = "{{" + key + "}}";
        if (template.indexOf(find) > -1) {
          template = template.replace(find, obj[key]);
          delete obj[key];
        }
      }
    }
    return template;
  }

}

window.customElements.define("ng-repeat", NgRepeat);
/*********************************************************************************************************/
