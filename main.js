const icons = document.querySelector(".icons");
const cartdom = document.querySelector(".cart_items");

const btnaddcart = document.querySelectorAll(".btn_add_to_cart")

const totalcount = document.querySelector("#total_count")

const totalcost = document.querySelector(".total_cost")

const checkoutbtn = document.querySelector(".check_out_btn")


let cartitems = (JSON.parse(localStorage.getItem("cart_items")) || []);


document.addEventListener("DOMContentLoaded" , loadate)

checkoutbtn.addEventListener("click", () => {
	if (confirm("Ma rabtaa Inaad iibsato ?")){
		clearitemcart();
	}
})

icons.addEventListener("click" , () => {
	cartdom.classList.toggle("active");
})

btnaddcart.forEach(btn  => {
	btn.addEventListener("click", ()=>{
		let parentElement = btn.parentElement;
		const product = {
			id : parentElement.querySelector("#product_id").value,
			name : parentElement.querySelector(".product_name").innerText,
			image : parentElement.querySelector("#image").getAttribute("src"),
			price : parentElement.querySelector(".product_price").innerText.replace("$",""),
			quantity : 1
		}
		let isInCart = cartitems.filter(item => item.id == product.id).length > 0 ;

		if (!isInCart) {
			additemtothedom(product);
		}else{
			alert("Product Allready in the cart");
			return;
		}

		const cartDomitems = document.querySelectorAll(".cart_item");

		cartDomitems.forEach(individualitem => {
			if (individualitem.querySelector("#Product_id").value === product.id) {
				increaseItem(individualitem,product);
				decreaseItem(individualitem,product);
				removeItem(individualitem,product);
			}
		})

		cartitems.push(product);
		calculateTotal();
		savelogicalstorage();
		localStorage.setItem("cart_items" , JSON.stringify(cartitems));
	})
})

function additemtothedom(product){
	cartdom.insertAdjacentHTML("afterbegin",`
		<div class="cart_item">
		            <input type="hidden" name="" id="Product_id" value="${product.id}">
		            <image src="${product.image}"alt=""id="Product_">
		            <h4 class="Product_name">${product.name}</h4>
		            <a class="btn_small" action="decrease">&minus;</a>
		            <h4 class="Product_Qtty">${product.quantity}</h4>
		            <a class="btn_small" action="increase">&plus;</a>
		            <span class="Product_price">${product.price}</span>
		            <a class="btn_small btn_remove" action="remove">&times;</a>
		        </div>
		`)
}

function calculateTotal(){
	let total = 0

	cartitems.forEach(item => {
		total += item.quantity * item.price; 
	})
	totalcost.innerText = total;
	totalcount.innerText = cartitems.length;
}

function increaseItem(individualitem,product){

	individualitem.querySelector("[action='increase']").addEventListener("click" , ()=> {
		cartitems.forEach(cartitem => {
			if (cartitem.id === product.id) {
				individualitem.querySelector(".Product_Qtty").innerText = ++cartitem.quantity;
			}
			localStorage.setItem("cart_items" , JSON.stringify(cartitems))
			calculateTotal();
			savelogicalstorage();
		})
	})
}

function decreaseItem(individualitem,product){

	individualitem.querySelector("[action='decrease']").addEventListener("click" , ()=> {
		cartitems.forEach(cartitem => {
			if (cartitem.id === product.id) {
				if (cartitem.quantity > 1) {
					individualitem.querySelector(".Product_Qtty").innerText = --cartitem.quantity;
				}else{
					cartitems = cartitems.filter(newElements => newElements.id !== product.id);
					individualitem.remove();
				}
				localStorage.setItem("cart_items" , JSON.stringify(cartitems))
				calculateTotal();
				savelogicalstorage();

			}
		})
	})
}

function removeItem(individualitem,product){

	individualitem.querySelector("[action='remove']").addEventListener("click" , ()=> {
		cartitems.forEach(cartitem => {
			if (cartitem.id === product.id) {
				cartitems = cartitems.filter(newElements => newElements.id !== product.id);
				individualitem.remove();
			}
			localStorage.setItem("cart_items" , JSON.stringify(cartitems));
			calculateTotal();
			savelogicalstorage();
		})
	})
}

function loadate(){
	if (cartitems.length > 0) {
		cartitems.forEach(product =>{
			additemtothedom(product);
			const cartDomitems = document.querySelectorAll(".cart_item");

			cartDomitems.forEach(individualitem => {
				if (individualitem.querySelector("#Product_id").value === product.id) {
					increaseItem(individualitem,product);
					decreaseItem(individualitem,product);
					removeItem(individualitem,product);
				}
			})

			calculateTotal();
			savelogicalstorage();
		})
	}
}

function savelogicalstorage(){
	localStorage.setItem("cart_items" , JSON.stringify(cartitems));
}

function clearitemcart(){
	localStorage.clear();
	cartitems = [];

	document.querySelectorAll(".cart_items").forEach(item =>{
		item.querySelectorAll(".cart_item").forEach(node =>{
			node.remove();
		});
	});
	calculateTotal();
}