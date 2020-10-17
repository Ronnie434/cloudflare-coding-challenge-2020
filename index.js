addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event));
});

const links = [
  {
    "name": "My Project for Cloudflare Assessment",
    "url": "https://github.com/Ronnie434/cloudflare-coding-challenge-2020/"
  },
  {
    "name": "My Portfolio",
    "url": "https://ronakpatel.me/"
  },
  {
    "name": "My Github - [Using 301 Redirect Via CloudFlare]",
    "url": "https://github.com/Ronnie434/"
  }
]


class AvatarTransformer {
  async element(element) {
    element.setAttribute("src", "https://ronakpatel.me/img/IMG_2.JPG");
  }
}
class BackgroundTransformer {
  async element(element) {
    element.setAttribute("class", "bg-blue-700");
  }
}
class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    links.forEach(link => {
      element.append(`<a href="${link.url}">${link.name}</a>`, { html: true });
    })
  }

}

class ProfileTransformer {
  async element(element) {
    element.removeAttribute('style');
    element.get
  }
}
class SocialTransformer {
  async element(element) {
    element.removeAttribute('style');
    element.append("<a href=\"https://linkedin.com/in/ronniepatel\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/61/61109.svg\"></a>", { html: true })
    element.append("<a href=\"https://github.com/Ronnie434\"><img src=\"https://www.flaticon.com/svg/static/icons/svg/37/37318.svg\"></a>", { html: true })
  }
}

class TitleTransformer {
  async element(element) {
    element.setInnerContent("Ronak Patel");
  }
}
class UsernameTransformer {
  async element(element) {
    element.setInnerContent("Ronak Patel");
  }
}

async function handleRequest(event) {
  const url = new URL(event.request.url);
  let element = url.pathname.split("/").filter(n => n);

  if (element[0] === "links") {
    const json = JSON.stringify(links, null, 2);
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })

  } else if (element[0] === undefined) {
    //const HTML = "<html><body>Index</body></html>";
    const headers = {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      },
    }

    const Response = await fetch("https://static-links-page.signalnerve.workers.dev/", headers)

    return new HTMLRewriter()
      .on("div#links", new LinksTransformer())
      .on("div#profile", new ProfileTransformer())
      .on("img#avatar", new AvatarTransformer())
      .on("h1#name", new UsernameTransformer())
      .on("title", new TitleTransformer())
      .on("div#social", new SocialTransformer())
      .on("body", new BackgroundTransformer())
      .transform(Response);
  } else {
    return new Response("Error 404", { status: "404" });
  }
}