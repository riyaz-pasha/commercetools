import { ApiRoot, MyCustomerDraft } from '@commercetools/platform-sdk'
import Client from '../client/Client'

type CustomerData = {
  email: string
  password: string
  firstName: string
  lastName: string
  countryCode: string
  key: string
}

type ICustomerOptions = {
  anonymousId?: object
}
interface ICustomerRepository {
  apiRoot: ApiRoot
  projectKey: string
  createCustomerDraft(customerData: CustomerData): object
  createCustomer(customerData: CustomerData): any | never
  getCustomer(
    {
      email,
      password,
    }: {
      email: string
      password: string
    },
    options: ICustomerOptions
  ): any | never
}

class CustomerRepository implements ICustomerRepository {
  apiRoot: ApiRoot
  projectKey: string
  constructor(options) {
    const rootClient = new Client(options)
    this.apiRoot = rootClient.getApiRoot(
      rootClient.getClientFromOption(options)
    )
    this.projectKey = rootClient.getProjectKey()
  }

  createCustomerDraft(customerData): MyCustomerDraft {
    const { email, password, firstName, lastName, countryCode, key } =
      customerData
    const country = process.env.DEFAULT_COUNTRY || countryCode || 'US'
    return {
      email,
      password,
      firstName,
      lastName,
      addresses: [
        {
          country: country,
        },
      ],
      defaultShippingAddress: 0,
    } satisfies MyCustomerDraft
  }

  async createCustomer(customerData) {
    try {
      const customer = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .signup()
        .post({
          body: this.createCustomerDraft(customerData),
        })
        .execute()

      // check to make sure status is 201
      return customer
    } catch (error) {
      return error
    }
  }

  async getCustomer({ email, password }, options) {
    try {
      const customer = await this.apiRoot
        .withProjectKey({ projectKey: this.projectKey })
        .me()
        .login()
        .post({
          body: {
            email,
            password,
            updateProductData: true,
            anonymousId: options?.anonymousId,
            anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
          },
        })
        .execute()

      return customer
    } catch (error) {
      return error
    }
  }

  async logoutCustomer() {
    try {
      return null
    } catch (error) {
      return error
    }
  }
}

export default CustomerRepository
