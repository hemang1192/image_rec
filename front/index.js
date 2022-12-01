
const imageForm = document.querySelector("#imageForm")
const imageInput = document.querySelector("#imageInput")

imageForm.addEventListener("submit", async event => {
  event.preventDefault()
  const file = imageInput.files[0]

  // get secure url from our server
  const { url } = await fetch("/s3Url").then(res => res.json())
  console.log(url)

  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    body: file
  })

  const imageUrl = url.split('?')[0]
  console.log(imageUrl)
  const img = document.createElement("img")
  img.src = imageUrl
  document.body.appendChild(img)


  const getImageName = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
  const identyImageURL = "https://df2gvugbnm6qsj6qvaive54y5a0dushp.lambda-url.us-east-2.on.aws/?queryparam1="+getImageName(imageUrl);
  // post requst to my server to store any extra data
  const response = await fetch(identyImageURL)
  if (response.ok) { 
    let json = await response.json();
    const obj = JSON.parse(JSON.stringify(json));
    const imageDescription = obj.Labels[0].Parents[0].Name;
    console.log(imageDescription);

    const imgType = document.createElement("p")
    imgType.textContent = JSON.stringify(imageDescription)
    document.body.appendChild(imgType)
  } else {
    alert("HTTP-Error: " + response.status);
  }
  
  
})
