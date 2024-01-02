import TitleSection from '@/components/landing-page/title-section'
import React from 'react'
import Banner from '../../../public/appBanner.png';
import Image from 'next/image';


const HomePage = () => {
  return (
    <section>
      <div className="overflow-hidden px-4 sm:px-6 mt-10 sm:flex sm:flex-col gap-4 md:justify-center md:items-center">
        <TitleSection pill="✨ Your Workspace, Perfected" title="A collaborative Home Page" subheading="" />
        <div className="bg-white p-[2px] mt-6 rounded-xl bg-gradient-to-r from-primary to-brand-primaryBlue sm:w-[300px]">
          <button className="w-full rounded-[10px] p-6 text-2xl bg-background">
            Get Cypress Free
          </button>
        </div>
        <div className="mg:mt-[-90px] sm:w-full w-[750px] flex justify-center items-center mt-[-40px] relative sm:ml-0 ml-[-50px]">
          <Image src={Banner} alt="Application Banner"/> 
        </div>
      </div>
    </section>
  )
}

export default HomePage