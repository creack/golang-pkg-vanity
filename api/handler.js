// Reference:
//   https://github.com/jozsefsallai/vercel-vanityurls/tree/master

function buildHTML(path, repo) {
  const trimmedRepo = repo.replace("https://", "");
  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    `<title>${path}</title>`,
    `<meta name="go-import" content="${path} git ${repo}">`,
    `<meta name="go-source" content="${path} _ ${repo}/tree/main{/dir} ${repo}/blob/main{/dir}/{file}#L{line}">`,
    `<meta http-equiv="refresh" content="0; url=https://pkg.go.dev/${trimmedRepo}" />`,
    "</head>",
    "<body>",
    `<a href="https://pkg.go.dev/${trimmedRepo}">Redirecting to documentations...</a>`,
    "</body>",
    "</html>",
    "",
  ].join("\n");
}

function getPackageName(url) {
  return url.includes("?") ? url.slice(1, url.indexOf("?")).trim() : url.slice(1).trim();
}

module.exports = (req, resp) => {
  if (req.url && req.url.toLowerCase() === "/favicon.ico") {
    resp.statusCode = 204;
    return resp.end();
  }

  const pkg = getPackageName(req.url);
  if (!pkg || !pkg.length) {
    resp.writeHead(204);
    return resp.end();
  }

  const username = "creack";
  const path = `${req.headers.host}/${pkg}`;
  const repo = `https://github.com/${username}/${pkg}`;
  return resp.send(buildHTML(path, repo));
};
