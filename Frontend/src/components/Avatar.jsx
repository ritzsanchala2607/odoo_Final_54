import React from 'react';
import './Avatar.css';

const Avatar = ({ src, alt, size = 'medium', className = '', onError }) => {
  const avatarClass = `avatar avatar-${size} ${className}`.trim();

  return (
    <div className={avatarClass}>
      <img src={src} alt={alt} onError={onError} />
    </div>
  );
};

export default Avatar;