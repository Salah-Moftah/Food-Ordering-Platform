import landingImage from '../assets/landing.png';
import appDownloadImage from '../assets/appDownload.png';
import SearchBar, { SearchForm } from '@/components/SearchBar';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (SearchFormValues: SearchForm) => {
    navigate({
      pathname: `/search/${SearchFormValues.searchQuery}`,
    })
  }

  return(
    <div className="flex flex-col gap-12">
      <div className="bg-white px-2 md:px-32 rounded-lg shadow-md flex flex-col gap-5 text-center -mt-16 py-8">
        <h1 className=" text-3xl md:text-5xl font-bold  text-orange-500">
          Tuck into a takeaway today
        </h1>
        <span className="text-xl">Food is just a click away!</span>
        <SearchBar placeHolder='Search by City or Town' onSubmit={handleSearchSubmit} />
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <img rel="preload" src={landingImage} alt='landingImage' />
        <div className='flex flex-col items-center justify-center gap-4 text-center'>
          <span className='font-bold text-3xl tracking-tighter'>
            Order takeaway even faster!
          </span>
          <span>
            Download the <span className='text-orange-500 font-bold'>SMEats</span> App for faster ordering and personalized recommendations
          </span>
          <img src={appDownloadImage} alt='appDownloadImage' />
        </div>
      </div>
    </div>
  )
}

export default HomePage;
