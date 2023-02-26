const video = document.getElementById('webcam')
const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)
const label = document.getElementById("label")
let classifier

const noNarutobtn = document.querySelector("#nonaruto")
const narutobtn = document.querySelector("#naruto")
const trainbtn = document.querySelector("#train")
const savebtn = document.querySelector("#save")

noNarutobtn.addEventListener("click", () => addNoNaruto())
narutobtn.addEventListener("click", () => addNaruto())
trainbtn.addEventListener("click", () => train())
savebtn.addEventListener("click", () => saveModel())

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then((stream) => {
            video.srcObject = stream
        })
        .catch((err) => {
            console.log("Something went wrong!");
        });
}

function modelLoaded() {
    console.log("The mobileNet model is loaded!")
    classifier = featureExtractor.classification(video, videoReady)
    classifier.load('./model.json', customModelLoaded)
}

function customModelLoaded() {
    console.log('custom model is loaded')
    startClassifying();
}

function videoReady() {
    console.log(classifier)
}

function addNoNaruto() {
    classifier.addImage(video, "Status: This ain't Naruto!", addedImage)
}

function addNaruto() {
    classifier.addImage(video, "Status: This is Naruto!", addedImage)
}

function train() {
    console.log("start training...")
    classifier.train((lossValue) => {
        console.log(lossValue)
        if (lossValue == null) {
            startClassifying()
        }
    })
}



function saveModel() {
    classifier.save();
}

function startClassifying() {
    setInterval(() => {
        classifier.classify(video, (err, result) => {
            if (err) console.log(err)
            console.log(result)
            label.innerHTML = result[0].label
        })
    }, 1000)
}

function addedImage() {
    console.log("added image to network")
}