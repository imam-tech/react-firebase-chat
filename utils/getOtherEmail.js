const getOtherEmail = (users, currentUser) => {
  console.log(users)
  return users?.filter(user => user !== currentUser.email)[0]
}

export default getOtherEmail;