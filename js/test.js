tables.database().ref().on('value', snapshot => {
    let snap = snapshot.val()
    console.log(snap)

})