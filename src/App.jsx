
import { useState, useRef } from 'react'
import { ScrollTopButton } from './components/ScrollTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hero from './components/Hero';
import { Calculator } from './components/Calculator';
import Results from './components/Results';
import { Footer } from './components/Footer';
import Header from './components/Header';




export default function App() {
  const [results, setResults] = useState(null)
  const calculatorRef = useRef(null);

  return (
    <>
      <ToastContainer 
        className='z-9999'
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" 
      />
      <Header/>
      <Hero/>
      <main className="max-w-content mx-auto px-[13%] pt-12 pb-20">
        <Calculator ref={calculatorRef} onResults={setResults} />
        {results && <Results data={results} calculatorRef={calculatorRef}/>}
      </main>
      <Footer/>
      <ScrollTopButton />
    </>
  )
}
