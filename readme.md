api to get data in one label<br>
method = get
url = `http://localhost:7000/glosarium?label=${label}` --> for sidebar sub

api to get data spesifik<br>
method = get
url = `http://localhost:7000/glosarium?label=${label}&komponen=${komponen}` --> for detail komponen

api to get all data<br>
method = get
url = `http://localhost:7000/glosarium/all` --> for dashboard

api to insert data<br>
method = post
url = `http://localhost:7000/glosarium/`

<b> data = { nama : padding, pengertian : ...., ilustrasi : image, penggunaan : ...., label: CSS/HTML/PHP, tags : [CSS/HTML/PHP, Arkademy, dll] } </b>
