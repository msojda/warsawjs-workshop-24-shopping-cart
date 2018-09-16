import shopApi from "../shopApi";

describe("shopApi", () => {
  const products = { productIds: [4], quantityById: { 4: 1 } };

  it("creates an order", async () => {
    const order = await shopApi.createOrder(products);
    expect(order.data.products).toEqual(products);
    expect(order.data.status).toEqual("NEW");
  });

  it("changes delivery method", async () => {
    const order = await shopApi.createOrder(products);
    const result = await shopApi.changeDeliveryMethod(
      order.data.orderNumber,
      "post"
    );
    const order2 = await shopApi.getOrder(order.data.orderNumber);

    expect(result.data.status).toBe("OK");
    expect(order2.data.deliveryMethod).toBe("post");
  });

  it("changes delivery address", async () => {
    const order = await shopApi.createOrder(products);
    const address = {
      fullname: "b",
      street: "cccc",
      city: "dddd",
      country: "UK"
    };
    const result = await shopApi.changeDeliveryAddress(
      order.data.orderNumber,
      address
    );
    const order2 = await shopApi.getOrder(order.data.orderNumber);

    expect(result.data.status).toBe("OK");
    expect(order2.data.deliveryAddress.fullname).toBe("b");
    expect(order2.data.deliveryAddress.street).toBe("cccc");
    expect(order2.data.deliveryAddress.city).toBe("dddd");
    expect(order2.data.deliveryAddress.country).toBe("UK");
  });

  it("submits an order", async () => {
    const order = await shopApi.createOrder(products);

    expect(order.data.status).toEqual("NEW");

    const result = await shopApi.submitOrder(order.data.orderNumber);
    const order2 = await shopApi.getOrder(order.data.orderNumber);

    expect(result.data.status).toBe("OK");
    expect(order2.data.status).toBe("SUBMITTED");
  });

  it("returns products", async () => {
    const result = await shopApi.getProducts();
    expect(result.data.products).toBeInstanceOf(Array);
    expect(result.data.products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        price: expect.any(Number),
        title: expect.any(String),
        image: expect.any(String)
      })
    );
  });
});
