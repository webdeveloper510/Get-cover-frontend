import React from 'react'
import Grid from './grid';

// media Import 
import SearchImage from '../assets/images/icons/search.svg';
import SettingImage from '../assets/images/icons/Setting.svg';
import NotificationImage from '../assets/images/icons/Notification.svg';
import ProfileImage from '../assets/images/icons/Profile.svg';
import Down from '../assets/images/icons/Drop.svg';

function Headbar() {
  return (
    <div className=''>
      <Grid >
        <div className='col-span-4'></div>
        <div className='col-span-3'></div>
        <div className='col-span-5'>
          <Grid className='border-2 w-[420px] ms-auto border-[#D1D1D1] flex self-center py-3 px-4 rounded-xl'>
            <div className='col-span-6 flex self-center justify-around border-r-2 border-[#D1D1D1]'>
              <div>
                <img src={SearchImage} className='cursor-pointer' alt="SearchImage" />
              </div>
              <div>
                <img src={NotificationImage} className='cursor-pointer' alt="NotificationImage" />
              </div>
              <div>
                <img src={SettingImage} className='cursor-pointer' alt="SettingImage" />
              </div>
            </div>
            <div className='col-span-6 self-center flex justify-around'>
                <img src={ProfileImage} alt='ProfileImage'/>
                <p className='text-light-black font-semibold text-base self-center'>Veronica</p>
                <img src={Down} className='cursor-pointer' alt='ProfileImage'/>
            </div>
          </Grid>
        </div>
      </Grid>
    </div>
  )
}

export default Headbar