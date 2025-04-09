import Client from '../client/Client'
import { ApiRoot } from '@commercetools/platform-sdk'

interface ICart {
  apiRoot: ApiRoot
  projectKey: string
  createCartForCurrentCustomer(cartDraft: CartDraft): object
  getActiveCart(): object
}

type CartDraft = {
  currency: string
  customerEmail?: string
}

type MyCartUpdate = {
  version: number
  actions: Array<MyCartUpdateAction>
}

type MyCartUpdateAction = {
  readonly action: 'addLineItem'
  readonly productId?: string
  readonly variantId?: number
  readonly quantity?: number
}

type MyCartRemoveItem = {
  version: number
  actions: Array<MyCartRemoveLineItemAction>
}

type MyCartRemoveLineItemAction = {
  readonly action: 'removeLineItem'
  readonly lineItemId: string
  readonly quantity?: number
}

type CartUpdateDraft = {
  version: number
  productId: string
  variantId: number
  quantity: number
}

type CartRemoveItemDraft = {
  version: number
  lineItemId: string
  quantity: number
}

class CartRepository implements ICart {
  apiRoot: ApiRoot
  projectKey: string

  constructor(options) {
    const rootClient = new Client(options)
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    )
    this.projectKey = rootClient.getProjectKey()
  }

  private createCustomerCartDraft(cartData) {
    const { customerEmail, shippingAddress } = cartData

    const country = process.env.DEFAULT_COUNTRY || 'US'
    const currency = process.env.DEFAULT_CURRENCY || 'USD'

    return {
      currency: currency,
      customerEmail,
      country: country,
      shippingAddress: {
        country: country,
        ...shippingAddress,
      }
    }
  }

  private createCartUpdateDraft(
    cartUpdateDraft: CartUpdateDraft
  ): MyCartUpdate {
    const action = 'addLineItem' // default value needed to tell the system we are adding an item to cart
    const { version, productId, variantId, quantity } = cartUpdateDraft
    return {
      version,
      actions: [
        {
          action,
          productId,
          variantId,
          quantity,
        },
      ],
    }
  }

  private createRemoveItemDraft(
    cartRemoveItemDraft: CartRemoveItemDraft
  ): MyCartRemoveItem {
    const action = 'removeLineItem' // default value needed to tell the system we are removing an item from the cart
    const { version, lineItemId, quantity } = cartRemoveItemDraft
    return {
      version,
      actions: [
        {
          action,
          lineItemId,
          quantity,
        },
      ],
    }
  }

  async createCartForCurrentCustomer(cartDraft: CartDraft) {
    try {
      const cart = await this.getActiveCart()
      if (cart?.statusCode == 200) return cart
      return this.createCart(cartDraft)
    } catch (error) {
      return error
    }
  }

  public async createCart(cartDraft: CartDraft) {
    try {

      const response = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .post({
          body: this.createCustomerCartDraft(cartDraft),
        })
        .execute()
      const { id, anonymousId, customerId } = response.body;
      console.log(`✅ Cart created successfully : `, { id, anonymousId, customerId });
      return response;
    } catch (error) {
      console.error(`‼️ Could not create cart : `, error.body?.errors);
      return error
    }
  }

  async getActiveCart() {
    try {
      let activeCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .activeCart()
        .get()
        .execute()

      // const deleteCart = await this.apiRoot
      //   .withProjectKey({ projectKey: this.projectKey })
      //   .me()
      //   .carts()
      //   .withId({ ID: activeCart.body.id })
      //   .delete({
      //     queryArgs: {
      //       version: activeCart.body.version,
      //     }
      //   })
      //   .execute()

      return activeCart
    } catch (error) {
      console.error(`‼️ Could not find active cart : `, error.body?.errors);
      return error
    }
  }

  async updateActiveCart(productDetails) {
    try {
      console.log(`⏳ Updating cart with `, productDetails);
      let { cartId, cartUpdateDraft } = productDetails
      // if cartId is undefined create an anonymous cart
      if (!cartId) {
        console.log(`⚠️ ${cartId} Cart not found while adding items. Hence creating new cart`);
        const { body } = await this.createCartForCurrentCustomer({
          currency: process.env.DEFAULT_CURRENCY,
        })
        cartId = body.id
        cartUpdateDraft.version = body.version
      }

      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: cartId })
        .post({ body: this.createCartUpdateDraft(cartUpdateDraft) })
        .execute()

      console.log("✅ Update success:", updatedCart.body);
      return updatedCart
    } catch (error) {
      return error
    }
  }

  async removeLineItem(productDetails) {
    try {
      const { body } = await this.getActiveCart()
      const updatedCart = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .carts()
        .withId({ ID: body.id })
        .post({ body: this.createRemoveItemDraft(productDetails) })
        .execute()

      console.log("✅ Removed item from cart:", { id: updatedCart.body.id });

      if (!updatedCart.body?.lineItems?.length) {
        // this should not be happening. doing it for now
        console.log(`⚠️ Cart has no items. Hence deleting this cart`);
        const deleteCart = await this.apiRoot
          .withProjectKey({ projectKey: this.projectKey })
          .me()
          .carts()
          .withId({ ID: body.id })
          .delete({
            queryArgs: {
              version: updatedCart.body.version,
            }
          })
          .execute()
        console.log("✅ Cart deleted successfully ", { id: deleteCart.body.id });
        return deleteCart;
      }

      return updatedCart
    } catch (error) {
      return error
    }
  }
}

export default CartRepository
