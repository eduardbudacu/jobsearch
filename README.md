# job search poc

# Heroku cli deployment 

Install cli 

Login with heroku credentials

```
heroku login -i
```

Create remote repository

```
heroku git:remote -a jobsearchro
```

Commit local changes

```
git commit -m "add a descriptive message here"
```

Push into the heroku remote 
```
git push heroku main
```