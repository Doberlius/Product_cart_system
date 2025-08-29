import { useState } from 'react'
import './style.css'
import Products from './data.json'
import CartImage from './assets/images/icon-add-to-cart.svg'
import RemoveItem from './assets/images/icon-remove-item.svg'
import CarbonImage from './assets/images/icon-carbon-neutral.svg'
import CakeEmpty from './assets/images/illustration-empty-cart.svg'
import CorrectIcon from './assets/images/icon-order-confirmed.svg'
function App() {
  const [products, setProducts] = useState(Products)
  const [cart, setCart] = useState([])
  const [showModal, setShowModal] = useState(false)

  const images =import.meta.glob('./assets/images/*', {eager: true, query: '?url', import: 'default'})

  // const getJSONImage = (image) => new URL(image, import.meta.url). href // import.meta resolved image path on vite
  const getJSONImage = (path) => {
    // Remove './' from JSON path to match glob keys
    const key = path.replace(/^\.\//, './')
    return images[key]
  }
  
  const updateCart = (product, delta) => {
    const existingItem = cart.find(item => item.name === product.name)
    if(existingItem){
      const newQuantity = existingItem.quantity + delta // update new Quantity
      if(newQuantity <= 0){
        setCart(cart.filter(item => item.name !== product.name)) // remove item if quantity <= 0
      }else{
        setCart(cart.map(item => item.name === product.name ? {...item, quantity:newQuantity} : item))  // update items if quantity > 0
      }
    }else if(delta >0){
      setCart([...cart, {...product, quantity: delta}]) // if delta > 0
      // product = { name: 'Cake', price: 5 }
      // { ...product, quantity: 1 } 
      // // Result: { name: 'Cake', price: 5, quantity: 1 }
    }
  }

  const getItemQuantity = (productName) => {
    const item = cart.find(item => item.name === productName)
    return item ? item.quantity : 0
  }

  const removeFromCart = (product) => {
    setCart(cart.filter(item => item.name != product.name));
  }
  

  return (
    <>
      <div className='min-h-screen w-full p-4 sm:p-8 lg:p-12 overflow-y-hidden'>
        <div className='w-full max-w-sm sm:max-w-lg md:max-w-7xl lg:max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8'>
          {/* Products Section */}
          <div className='flex-1'>
            <h1 className='text-3xl lg:text-4xl font-bold mb-6'>Dessert</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {products.map((product, index) => (
                <div key={index} className='products-card bg-white rounded-2xl p-4'>
                  <div className='w-full mb-3'>
                    <div className='relative'>
                      <img 
                        src={getJSONImage(product.image.desktop)} 
                        alt={product.name} 
                        className='w-full h-auto object-cover rounded-2xl' 
                      />
                      <div className='absolute -bottom-5 left-1/2 -translate-x-1/2'>
                        {getItemQuantity(product.name) === 0 ? (
                          <button 
                          onClick={() => updateCart(product, 1)}
                          className='px-6 py-3 bg-amber-50 text-black text-sm border-2 rounded-full border-gray-600 hover:bg-amber-500 transition-colors inline-flex items-center justify-center whitespace-nowrap' /* inline-flex: keep everything inline, whitespace-nowrap: prevent breaking lines */
                          >  
                            <img src={CartImage} alt="cart" className='w-4 h-4 mr-2' />
                            <span>Add to cart</span>
                          </button>
                        ) : (
                          <div className='flex items-center gap-4 px-4 py-2 bg-amber-50 border-2 rounded-full border-gray-600 hover:bg-orange-700'>
                            <button
                              onClick={() => updateCart(product, -1)}
                              className='text-lg font-bold text-gray-600 hover:text-amber-50 rounded-full border-2 border-transparent hover:border-amber-50 p-[4px]'
                            >-</button>
                            <span className='w-8 text-center'>{getItemQuantity(product.name)}</span>
                            <button
                              onClick={() => updateCart(product, 1)}
                              className='text-lg font-bold text-gray-600 hover:text-amber-50 rounded-full border-2 border-transparent hover:border-amber-50 p-[4px]'
                            >+</button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='description mt-9'>
                      <div className='text-md text-gray-500'>{product.category}</div>
                      <div className='text-lg text-black'>{product.name}</div>
                      <div className='text-lg font-bold' style={{color:'#87635a'}}>${product.price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Section */}
          <div className='w-full lg:w-[400px]'>
            <h1 className='text-2xl text-orange-500 font-bold mb-5'>Your cart ({cart.reduce((total, item)=> total+item.quantity, 0)})</h1>
            <div className='bg-white rounded-2xl p-6'>
              {cart.length === 0 ? (
                <div className='flex flex-col items-center text-yellow-800 py-4'>
                  <img src={CakeEmpty} alt="CakeEmpty" className='w-40 h-40'/>
                  Your added items will appear here.
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {cart.map((item, index) => (
                    <div key={index} className='flex items-center justify-between border-b-2 border-amber-100 pb-2'>
                        <div> 
                          <div className='font-medium'>{item.name}</div>
                          <span className='text-md' style={{color: '#87635a'}}>{item.quantity}x</span>
                          <span className='text-md text-gray-500 mx-2'>@{(item.price).toFixed(2)}</span>
                          <span className='text-md text-gray-700'>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        <div>
                          <button
                            onClick={() => removeFromCart(item)}
                            className='w-5 h-5 bg-white border-gray-500 border-2 p-1 rounded-full'
                          >
                            <img src={RemoveItem} alt="removeItem" className='w-full h-full object-contain'/>
                          </button>
                        </div>
                      </div>
                  ))}
                  <div className='my-4 pt-4 border-amber-100'>
                    <div className='flex justify-between items-center'>
                      <span className='font-medium'>Order Total</span>
                      <span className='font-bold text-2xl'>
                        ${(cart.reduce((total, item) => total + (item.price * item.quantity), 0)).toFixed(2)}
                      </span>
                    </div>
                    <div className='my-6 text-gray-500 flex flex-row justify-center'><img src={CarbonImage} alt="CarbonTree" className='w-5 h-5 object-contain mr-1'/>This is a <span className='text-black font-bold mx-1'>carbon neutral</span>delivery</div>
                    <button 
                      className='w-full mt-6 bg-orange-700 text-lg text-white p-3 rounded-full hover:-translate-y-2 hover:shadow-xl/30 duration-300 ease-in'
                      onClick={()=> setShowModal(true)}
                    >Confirm Order</button>
                    
                    {showModal && (
                      <div className='fixed inset-0 bg-black/70 bg-opacity-70 flex items-center justify-center z-10'>
                        <div className='bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto'>
                          <img src={CorrectIcon} alt="correctIcon" className='w-15 h-15 object=contain'/>
                          <h2 className='text-3xl font-bold mb-4 mt-3'>Order Confirmed</h2>
                          <h2 className='text-lg text-yellow-800'>I hope you enjoy your food :)</h2>
                          <div className='my-5 p-4'>
                            {cart.map((product, index) => (
                              <div key={index} className='flex justify-between mb-2'>
                                <div className='flex gap-3 w-full'>
                                  <img src={getJSONImage(product.image.thumbnail)} alt="ShowdownImage" className='w-15 h-15 object-contain rounded-lg'/>
                                  <div className='flex flex-col flex-1'>
                                    <span>{product.name}</span>
                                    <div className='flex flex-row items-center justify-between w-full'>
                                      <div className='flex gap-x-4'>
                                        <span className='text-yellow-800 text-md'>x{product.quantity}</span>
                                        <span className='text-gray-500'>@{(product.price).toFixed(2)}</span>
                                      </div>
                                      <span className='text-lg font-bold'>${(product.price * product.quantity).toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className='mt-6 flex justify-between'>
                            <span className='text-lg'>Order Total</span>
                            <span className='text-2xl font-bold'>${(cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2))}</span>
                          </div>
                          <button className='my-5 w-full p-3 bg-orange-600 rounded-full text-white  hover:-translate-y-2 hover:shadow-xl/30 duration-300 ease-in'>Start new order</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
