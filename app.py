import csv
from flask import Flask, render_template, request, redirect, url_for
import chat_server 
from threading import Thread
import socket

app = Flask(__name__, static_url_path='/static')

global server 
global particpants_dict
particpants_dict = {}

server = True


def validate_login(username,password):
    with open('users.csv', 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            if row['username'] == username and row["password"] == password:
                return row["name"]
    return False

def create_account(name, username, password):
    with open('users.csv', 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([name, username, password])


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        print(username,password)
        global validate_user

        validate_user = validate_login(username, password)
        if validate_user:
            return redirect(url_for('game', user_name = validate_user))
            # return render_template("host.html",user_name = validate_user )
        else:
            return 'No account found.'
    return render_template('index.html')



@app.route('/create_account', methods=['GET', 'POST'])
def create_account_page():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form["password"]
        if validate_login(username,password):
            return 'User already exists!'
        else:
            name = request.form['name']
            password = request.form['password']
            create_account(name, username, password)
            return 'Account created successfully!'
    return render_template('create_account.html')


@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')



@app.route('/game')
def game():
    # user = request.args.get('user_name')
    # option = request.form['submit']
    # ROOM = request.form["port"]
    user_name =  request.args.get('user_name')
    ip_ad = get_wifi_ip_address()

    serverON(ip_ad)

    return render_template("bingo.html", user_name = user_name,ip_address = ip_ad )



def serverON(ip_ad):
    global server
    if server: 
        print("started.........server first time.")
        thread = Thread(target=chat_server.hostServer, args=(ip_ad,int("3390"),))
        thread.start()
        server = False


def get_wifi_ip_address():
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname_ex(hostname)[-1][-1]
    return ip_address


if __name__ == '__main__':
    app.run(host='192.168.1.14', port=5000,debug = True)
