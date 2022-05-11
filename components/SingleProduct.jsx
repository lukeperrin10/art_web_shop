import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCart } from 'react-use-cart'
import Image from 'next/image'
import Button from './ui/Button'
import HopHelper from '../pages/api/helpers'
import { useDispatch } from 'react-redux'
import { errorMessage, successMessage } from '../redux/reducers/message.slice'

const SingleProduct = ({ props, activeCurrency }) => {
  const { addItem } = useCart()
  const dispatch = useDispatch()
  const router = useRouter()
  const [variantQuantity, setVariantQuantity] = useState(1)
  const [activeVariantId, setActiveVariantId] = useState(
    router.query.variantId || props.variants[0].id
  )

  useEffect(() => {
    const url = `/products/${props.slug}?variant=${activeVariantId}`

    router.replace(url, url, { shallow: true })
  }, [activeVariantId])

  const activeVariant = props.variants.find(
    (variant) => variant.id === activeVariantId
  )
  const changeVariant = (event) => setActiveVariantId(event.target.value)

  const updateQuantity = (event) =>
    setVariantQuantity(Number(event.target.value))

  const addToCart = () => {
    const itemMetadata = router.locales.reduce(
      (acc, locale) => ({
        ...acc,
        [locale]: {
          ...props.localizations.find(
            (localization) => localization.locale === locale
          ),
        },
      }),
      {}
    )
    let popUpMessage = 'Product added to cart'
    try {
      let product = {
        id: activeVariantId,
        name: props.name,
        size: activeVariant.name,
        productId: props.id,
        image: props.images[0],
        price: props.price,
        ...itemMetadata,
      }

      addItem(product, variantQuantity)
      dispatch(successMessage(popUpMessage))
    } catch (error) {
      dispatch(errorMessage('Something went wrong please try again later'))
    }
  }

  return (
    <div className='product-page'>
      <div className='product-page__container'>
        <h1>{props.name}</h1>
        <div className='product-page__text'>
          <p>{props.description}</p>
          <div>
            <select value={activeVariantId} onChange={changeVariant}>
              {props.variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
            </select>
            <select
              id='quantity'
              name='quantity'
              value={variantQuantity}
              className='block appearance-none w-full bg-gainsboro border-2 border-gainsboro focus:border-slategray px-4 py-3 pr-8 focus:outline-none focus:bg-white text-slategray focus:text-slategray rounded-lg'
              onChange={updateQuantity}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const value = Number(i + 1)

                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              })}
            </select>
          </div>
          <p>
            {HopHelper.numberFormatter({
              currency: activeCurrency,
              value: props.price,
            })}
          </p>
        </div>
        <div className='product-page__btn-container'>
          <Button onClick={() => addToCart()} className='product-page__btn'>
            Add to cart
          </Button>
        </div>
      </div>
      <div className='product-page__image'>
        <Image
          src={props.images[0].url}
          alt={props.name}
          height={600}
          width={600}
        />
      </div>
    </div>
  )
}

export default SingleProduct
