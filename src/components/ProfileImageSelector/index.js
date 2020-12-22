import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import ProfileImage from './ProfileImage';

function ProfileImageSelector({ onChange, value, pictures }) {
  const handleOnClick = (event) => onChange(event);

  return (
    <>
      <Header as="h5">Select a profile image</Header>
      <Segment style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        {pictures.map((picture) => (
          <ProfileImage key={picture} url={picture} onClick={handleOnClick} value={value} />
        ))}
      </Segment>
    </>
  );
}

export default ProfileImageSelector;
