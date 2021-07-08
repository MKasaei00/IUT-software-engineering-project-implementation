from django.db import models
from django.db.models.base import Model
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Project(models.Model):
    pass

class NormalUser(AbstractUser):
    is_sys_defined = models.BooleanField()
    is_staff = models.BooleanField(default=False)

class TeamMember(models.Model):
    base_user = models.ForeignKey(NormalUser,on_delete=models.CASCADE)
    team_title = models.CharField(max_length=50)
    job_title = models.CharField(max_length=50)


class Deadline(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateTimeField('start date')
    end_date = models.DateTimeField('end date')
    creator = models.ForeignKey(NormalUser,on_delete=models.CASCADE)
    #status

class TeamManager(models.Model):
    base_user = models.ForeignKey(NormalUser,on_delete=models.CASCADE)
    team_title = models.CharField(max_length=50)

class Team(models.Model):
    name = models.CharField(max_length=50)
    Manager = models.ForeignKey(TeamManager,on_delete=models.CASCADE)

class Task(models.Model):
    title = models.CharField(max_length=50)
    creator = models.ForeignKey(NormalUser,on_delete=models.CASCADE,related_name='creator')
    assigned_to = models.ForeignKey(NormalUser,on_delete=models.CASCADE,related_name='assigned_to')
    assigned_to_team = models.ForeignKey(Team,on_delete=models.CASCADE)
    #completion_status = 

class ProjectManager(models.Model):
    base_user = models.ForeignKey(NormalUser,on_delete=models.CASCADE)

