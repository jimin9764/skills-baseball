// 방문자 정보 가져오기
async function visitorsData() {
    const response = await fetch("./선수제공파일/B_Module/visitors.json");
    const data = await response.json();
    return data;
}

// 굿즈 정보 가져오기
async function goodsData() {
    const response = await fetch("./선수제공파일/B_Module/goods.json");
    const data = await response.json();
    return data;
}

let maxCount = 0;

async function chartView() {
    let data = await visitorsData();
    const league = document.querySelector("#league").value;
    const week = document.querySelector("#week").value;

    data = data.data[league].visitors[week].visitor;

    return data;
}

// 세로 차트 띄우기
async function widthChart() {
    const chartElem = document.querySelector("#chartDiv");
    chartElem.innerHTML = "";
    chartElem.className = "chart_width";

    const data = await chartView();

    Object.entries(data).forEach(([time, count]) => {
        if (count >= 500) {
            maxCount = 500;
        } else {
            maxCount = count;
        }

        chartElem.innerHTML += `
            <div class="width_parents">
            <p>${time}</p>
            <div class="width" style="width: ${count}px;">${count}명</div>
            </div>`;
    });
}

// 가로 차트 띄우기
async function heightChart() {
    const chartElem = document.querySelector("#chartDiv");
    chartElem.innerHTML = "";
    chartElem.className = "chart_height";

    const data = await chartView();

    Object.entries(data).forEach(([time, count]) => {
        if (count >= 500) {
            maxCount = 500;
        } else {
            maxCount = count;
        }

        chartElem.innerHTML += `
            <div class="height_parents">
            <p>${time}</p>
            <div class="height" style="height: ${count}px;">${count}명</div>
            </div>`;
    });
}

// goods Group 체크박스 추가
async function goodsGroupAdd() {
    const data = await goodsData();

    const goodsGroupList = [...new Set(data.data.map((item) => item.group))];

    const goodsGroupElem = document.querySelector("#goodsGroup");
    goodsGroupList.forEach((group) => {
        goodsGroupElem.innerHTML += `
    <div>
        <input id="${group}" value="${group}" type="checkbox">
        <p>${group}</p>
        </div>
        `;
    });
}

async function goodsListSort() {
    const data = await goodsData();
    const sortvalue = document.querySelector("#sort").value;
    let goodsSortList;

    const checkboxes = document.querySelectorAll(
        "#goodsGroup input[type='checkbox']"
    );

    const checkedGroups = Array.from(checkboxes)
        .filter((checkbox) => checkbox.checked)
        .map((checkbox) => checkbox.value);

    const filteredGoods = data.data.filter((item) => checkedGroups.includes(item.group));

    if (sortvalue == "saleDesc") {
        goodsSortList = [...filteredGoods].sort((a, b) => b.sale - a.sale);
    } else if (sortvalue == "saleAsc") {
        goodsSortList = [...filteredGoods].sort((a, b) => a.sale - b.sale);
    } else if (sortvalue == "priceDesc") {
        goodsSortList = [...filteredGoods].sort((a, b) => Number(b.price.replace(",", "")) - Number(a.price.replace(",", "")));
    } else if (sortvalue == "priceAsc") {
        goodsSortList = [...filteredGoods].sort((a, b) => Number(a.price.replace(",", "")) - Number(b.price.replace(",", "")));
    }

    const goodsListElem = document.querySelector("#goodsList");
    const bestGoodsListElem = document.querySelector("#bestGoods");

    goodsSortList.forEach((item, index) => {
        if (index < 3) {
            bestGoodsListElem.innerHTML += `
        <div class="card" style="width: 18rem;">
            <img src="./선수제공파일/B_Module/${item.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">[BEST 상품] ${item.title}</h5>
                <p class="card-text">판매량: ${item.sale}</p>
                <p class="card-text">가격: ${item.price}</p>
                <p class="card-text">분류: ${item.group}</p>
                <button onclick="goodsEditModalShow(${item.idx})" class="btn btn-primary w-75">수정제안</button>
            </div>
        </div>
        `;
        } else {
            goodsListElem.innerHTML += `
        <div class="card" style="width: 18rem;">
            <img src="./선수제공파일/B_Module/${item.img}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">판매량 : ${item.sale}</p>
                <p class="card-text">가격 : ${item.price}</p>
                <p class="card-text">분류 : ${item.group}</p>
                <button onclick="goodsEditModalShow(${item.idx})" class="btn btn-primary w-75">수정제안</button>
            </div>
        </div>
    `;
        }
    });
}

let editImgStatus = false;
let currentImgUrl = "";

async function goodsEditModalShow(idx) {
    const data = await goodsData();
    const goods = data.data.find((item) => item.idx);
    const goodsEditElem = document.querySelector("#goodsEditImg");

    if (editImgStatus && currentImgUrl) {
        goodsEditElem.innerHTML = "";
        goodsEditElem.style.backgroundImage = `url(${currentImgUrl})`;
    } else {
        goodsEditElem.innerHTML = `<h4>이미지를 추가 해 주세요 :)</h4>`;
        goodsEditElem.style.backgroundImage = "";
    }

    const modalTitleElem = document.querySelector("#goodsModalTitle");
    modalTitleElem.innerHTML = `<h5 class="modal-title">${goods.title} 수정제안</h5>`;

    $("#goodsModal").modal("show");
}

function addImg() {
    editImgStatus = true;
    $("#imgInput").click();
}

function addEditImg() {
    const img = document.querySelector("#imgInput").files[0];
    const goodsEditElem = document.querySelector("#goodsEditImg");
    goodsEditElem.innerHTML = "";

    const imgUrl = URL.createObjectURL(img);
    currentImgUrl = imgUrl;

    goodsEditElem.style.backgroundImage = `url(${imgUrl})`;
}

function addTextBox() {
    if(editImgStatus == false) {
        alert("이미지 추가 후 글상자 추가가 가능합니다.");
    } else {
        const goodsEditElem = document.querySelector("#goodsEditImg");

        const textBox = document.createElement("div");
        textBox.classList.add("textbox");
        textBox.content = "텍스트을 입력해 주세요";
        textBox.contentEditable = true;

        goodsEditElem.appendChild(textBox);
    }
}

function deleteTextBox() {
    const editImg = document.querySelector("#goodsEditImg");

    const textBoxs = Array.from(document.querySelectorAll("#goodsEditImg *"));
    if(editImgStatus == false) {
        alert("이미지를 추가해 주세요!");
    } else if (textBoxs.length == 0) {
        alert("글상자 요소가 없습니다.");
    } else {
        editImg.innerHTML = "";
    }
}

function deleteImg() {
    const editImgElem = document.querySelector ("#goodsEditImg");
    editImgElem.style.backgroundImage = "";
    
    editImgStatus = false;
    editImgElem.innerHTML = `<h4>이미지를 추가 해 주세요 :)</h4>`;
}
