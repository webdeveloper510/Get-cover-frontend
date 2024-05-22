import React from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const CommonTooltip = ({ id, children, content, place = 'top', effect = 'solid' }) => {
  return (
    <div className='cursor-pointer'>
      <Tooltip id={id} place={place} effect={effect}>
        {content}
      </Tooltip>
      <div data-tooltip-id={id}>
        {children}
      </div>
    </div>
  );
};

export default CommonTooltip;
