awhile=3
sleep $awhile && open http://localhost:8000/app/index.html
python -m SimpleHTTPServer

# bower install <package> --save
# npm install --save <package>
# grunt wiredep
