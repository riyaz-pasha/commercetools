import Client from '../client/Client'
import { ApiRoot } from '@commercetools/platform-sdk'

interface IProductRepository {
  apiRoot: ApiRoot
  projectKey: string
  getProducts(): any | Error
}

class Product implements IProductRepository {
  apiRoot: ApiRoot
  projectKey: string
  constructor(options) {
    const rootClient = new Client(options)
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    )
    this.projectKey = rootClient.getProjectKey()
  }

  async getProducts() {
    try {
      const country = process.env.DEFAULT_COUNTRY || 'US'
      const currency = process.env.DEFAULT_CURRENCY || 'USD'
      const products = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .products()
        .get({
          queryArgs: {
            priceCountry: country,
            priceCurrency: currency
          }
        })
        .execute()

      return products
    } catch (error) {
      return error
    }
  }
}

export default Product
