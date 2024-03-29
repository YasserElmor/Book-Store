const deleteProduct = async (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('article');
    const response = await fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrfToken
        }
    });
    const msg = (await response.json()).message;
    if (msg === "Success") {
        productElement.remove();
    }
};