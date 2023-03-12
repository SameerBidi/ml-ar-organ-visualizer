$(document).ready(function() {

});

const nftData = {
    "heartNft": { 
		modelId: "heartModel",
		data: {
			name: "Heart",
			type: "Vital Muscular Organ, Essential for Life",
			desc: "The heart is a vital organ responsible for circulating blood throughout the body, delivering oxygen and nutrients to cells and organs. It is located in the chest cavity and is roughly the size of a closed fist. The heart is divided into four chambers and works by contracting and relaxing in a rhythmic pattern, controlled by electrical signals. Cardiovascular health is important for overall wellbeing, and lifestyle choices such as exercise and diet can play a significant role in maintaining a healthy heart.",
			image: "/images/heart/Heart.jpg",
			extras: [
				{
					name: "Atria",
					desc: "The heart has two atria, which are the upper chambers of the heart. The right atrium receives deoxygenated blood from the body through the superior and inferior vena cava, while the left atrium receives oxygenated blood from the lungs through the pulmonary veins.",
					image: "/images/heart/Atria.jpg"
				},
				{
					name: "Ventricule",
					desc: "The heart has two ventricles, which are the lower chambers of the heart. The right ventricle pumps deoxygenated blood to the lungs through the pulmonary artery, while the left ventricle pumps oxygenated blood to the body through the aorta.\n\nThe walls of the ventricles are thicker and more muscular than the atria, as they must contract strongly to pump blood out of the heart and into the circulatory system. The contraction of the ventricles is also controlled by electrical signals, which originate in the atrioventricular (AV) node and travel down the bundle of His and Purkinje fibers.",
					image: "/images/heart/Ventricule.jpg"
				},
				{
					name: "Valve",
					desc: "The heart has four valves that regulate blood flow between the chambers and prevent backflow. The valves include the tricuspid valve and pulmonary valve on the right side of the heart, and the mitral valve and aortic valve on the left side of the heart.",
					image: "/images/heart/Valve.jpg"
				}
			]
		}
	},
    "lungsNft": { 
        modelId: "lungsModel", 
        //data: { "name": "Left Lobe", "mesh_name": "Object_5", "type": "Mesh", "point": { "x": -1.1910968070960013, "y": 0.14475345664059702, "z": -6.469361739073049 } }
        data: {
            name: "Lungs",
            type: "Vital Organ of the Respiratory System",
            desc: "The lungs are the primary organs of the respiratory system and are responsible for exchanging oxygen and carbon dioxide between the air and blood. They are located on either side of the chest and are protected by the ribcage.",
            image: "/images/lungs/Lungs.jpg",
            extras: [
                {
                    name: "Trachea",
                    desc: "The trachea, also known as the windpipe, is a cartilaginous tube that connects the larynx to the bronchi, allowing air to pass in and out of the lungs during respiration.",
                    image: "/images/lungs/Trachea.jpg"
                },
                {
                    name: "Larynx",
                    desc: "The larynx, commonly known as the voice box, is a cartilaginous structure located in the neck that plays a key role in speech and breathing. It contains the vocal cords, which vibrate to produce sound when air is passed through them, and also serves as a protective mechanism to prevent food or liquid from entering the trachea during swallowing.",
                    image: "/images/lungs/Larynx.jpg"
                }
            ]
        }
    }
}

let activeNft;

function initNftData() {
    for (const [nftId, modelData] of Object.entries(nftData)) {
        let model = document.querySelector("#" + modelData.modelId);
        model.setAttribute("visible", false);
        modelData.model = model;
        modelData.initPos = model.getAttribute("position");
        modelData.initScale = model.getAttribute("scale");
        modelData.initRot = model.getAttribute("rotation");
    }

    console.log(nftData);
}

function setActiveNft(nftId) {
    activeNft = nftData[nftId];
}

const deepFind = (pred) => ([x, ...xs] = []) =>
    x && (pred(x) ? x : deepFind(pred)(x.children) || deepFind(pred)(xs))

const findByName = (name) => (obj) =>
    deepFind((o) => o.name == name)([obj])

AFRAME.registerComponent('markerhandler', {
    init: function () {
        initNftData();
        this.el.addEventListener('markerFound', () => {
            let nftId = this.el.id;
            setActiveNft(nftId);
            activeNft.model.setAttribute("visible", true);
            let model = activeNft.model;

            //console.log(findNestedChildren(lungsModel.object3DMap.mesh, "name", "Object_5", null));
            // console.log();

            // let modelGeoData = findByName(activeNft.data.mesh_name)(model.object3DMap.mesh);

            // showTooltips(activeNft.data, modelGeoData.geometry, this.el.sceneEl.camera);

			//showInfoModal(activeNft.data);
            showInfoBox(true, activeNft.data);
        });

        this.el.addEventListener('markerLost', () => {
            if (activeNft) activeNft.model.setAttribute("visible", false);
            showInfoBox(false);
        });
    },
    tick: function () {
    }
});

function showInfoBox(show, data) {
    let infoBox = $("#infoBox");

    if(!show) {
		infoBox.addClass("d-none");
		return;
	}

    let infoName = infoBox.find("#infoName");
    let infoType = infoBox.find("#infoType");
	let infoBtn = infoBox.find("#infoBtn");

    infoName.html(data.name);
	infoType.html(data.type);

	infoBtn.off("click.info");
	infoBtn.on("click.info", function() {
		showInfoModal(data);
		showInfoBox(false);
	});

	infoBox.removeClass("d-none");
}

function showInfoModal(data) {
	let infoModal = $("#infoModal");

	let infoModalTitle = infoModal.find("#infoModal_Title");
	let infoModalImage = infoModal.find("#infoModal_Image");
	let infoModalDesc = infoModal.find("#infoModal_Desc");

	let infoModalExtraHolder = infoModal.find("#infoModal_ExtraHolder");

	infoModalTitle.html(data.name);
	infoModalImage.prop("src", data.image);
	infoModalDesc.html(data.desc);

	infoModalExtraHolder.find("div.info-extra").not(":first").remove();

	data.extras.forEach(function(extra, index) {
		let idAppend = "_" + index;

		let infoExtra = infoModalExtraHolder.find("#infoModal_Extra").clone(true);
		infoExtra.prop("id", infoExtra.prop("id") + idAppend);

		let infoExtraTitle = infoExtra.find("#infoModal_ExtraTitle");
		infoExtraTitle.prop("id", infoExtraTitle.prop("id") + idAppend);

		let infoExtraImage = infoExtra.find("#infoModal_ExtraImage");
		infoExtraImage.prop("id", infoExtraImage.prop("id") + idAppend);

		let infoExtraDesc = infoExtra.find("#infoModal_ExtraDesc");
		infoExtraDesc.prop("id", infoExtraDesc.prop("id") + idAppend);

		infoExtraTitle.html(extra.name);
		infoExtraImage.prop("src", extra.image);
		infoExtraDesc.html(extra.desc);

		infoExtra.removeClass("d-none");

		infoModalExtraHolder.append(infoExtra);
	});

	infoModal.modal("show");
}

function showTooltips(data, modelGeo, camera) {
    let tooltip = document.getElementById("tooltip");

    let point = data.point;

    let tooltipPos = new THREE.Vector3();

    tooltipPos.x = point.x;
    tooltipPos.y = point.y;
    tooltipPos.z = point.z;

    tooltipPos.project(camera);

    tooltipPos.x = (tooltipPos.x + 1) * window.innerWidth / 2;
    tooltipPos.y = -(tooltipPos.y - 1) * window.innerHeight / 2;

    tooltip.style.left = tooltipPos.x - (tooltip.clientWidth / 2);
    tooltip.style.top = tooltipPos.y - (tooltip.clientHeight * 2);

    console.log(tooltipPos.x - (tooltip.width / 2));
}