import React from 'react';
import { Image } from 'semantic-ui-react';

function ProfileImage({ onClick, value, url }) {
  return (
    <Image
      src={url}
      circular
      onClick={onClick}
      disabled={value !== url}
      name="profileImage"
      size="medium"
      style={{ margin: 1.5 }}
    />
  );
}

export default ProfileImage;
