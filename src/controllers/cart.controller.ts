import CartService from "../services/cart.service";

class CartController {
  async addTocart(dto: any) {
    let response = await CartService.addTocart(dto);
    return response;
  }
  async cart() {
    let response = await CartService.cart();
    return response;
  }

  async deleteItem(dto: any) {
    let response = await CartService.deleteItem(dto);
    return response;
  }

  async emptyCart() {
    let response = await CartService.emptyCart();
    return response;
  }

  async updateItem(dto: any) {
    let response = await CartService.updateItem(dto);
    return response;
  }
}

export default new CartController();
