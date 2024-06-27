export const getCartData = () => {
    const cartData = JSON.parse(localStorage.getItem('cart')) || [];
    return cartData;
}

export const addToCart = (product) => {
    const cartData = getCartData();
    cartData.push(product);
    localStorage.setItem('cart', JSON.stringify(cartData));
}