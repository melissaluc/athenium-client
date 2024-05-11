import Avatar from '@mui/material/Avatar';

function CircularAvatar ({src, alt, width, height}) {

    return (
        <Avatar
          src={src}
          alt={alt}
          sx={{
            width: width, // Adjust the width and height to your preference
            height: height,
            borderRadius: '50%', // Make the avatar circular
          }}
        />
      );


}


export default CircularAvatar;