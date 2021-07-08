from django.db import models
from django.db.models import manager
from django.db.models.base import Model
from django.contrib.auth.models import AbstractUser

# Create your models here.



class NormalUser(AbstractUser):
    is_sys_defined = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)



class Deadline(models.Model):
    name = models.CharField(max_length=50)
    start_date = models.DateTimeField('start date')
    end_date = models.DateTimeField('end date')
    tasks = models.ManyToManyField('Task')
    project = models.ForeignKey('Project',on_delete=models.CASCADE,related_name='project')
    status_choices = [
        ('C','Completed'),
        ('IP','In Progress'),
        ('M','Missed')
    ]
    status = models.CharField(
        max_length=2,
        choices=status_choices,
        default='IP'
    )


class Project(models.Model):
    title = models.CharField(max_length=50)
    main_deadline = models.ForeignKey('Deadline',on_delete=models.SET_NULL,null=True,related_name='main_deadline')


class Task(models.Model):
    title = models.CharField(max_length=50)
    creator = models.ForeignKey('NormalUser',on_delete=models.SET_NULL,null=True,related_name='creator')
    assigned_to = models.ForeignKey('NormalUser',on_delete=models.SET_NULL,null=True,related_name='assigned_to')
    assigned_to_team = models.ForeignKey('Team',on_delete=models.SET_NULL,null=True)
    project = models.ForeignKey('Project',on_delete=models.CASCADE)
    status_choices = [
        ('NC','Not Completed'),
        ('CP','Check Pending'),
        ('C','Completed'),
        ('F','Failed')
    ]
    completion_status = models.CharField(
        max_length=2,
        choices=status_choices,
        default='NC'
    )

class Team(models.Model):
    name = models.CharField(max_length=50)
    manager = models.ForeignKey('TeamManager',on_delete=models.SET_NULL,null=True,related_name='manager')
    project = models.ForeignKey('Project',on_delete=models.CASCADE)

class TeamMember(models.Model):
    base_user = models.ForeignKey('NormalUser',on_delete=models.CASCADE)
    team = models.ForeignKey('Team',on_delete=models.CASCADE)
    job_title = models.CharField(max_length=50)


class TeamManager(models.Model):
    base_user = models.ForeignKey('NormalUser',on_delete=models.CASCADE)
    team = models.ForeignKey('Team',on_delete=models.CASCADE,related_name='team')


class ProjectManager(models.Model):
    base_user = models.ForeignKey('NormalUser',on_delete=models.CASCADE)
    Project = models.ForeignKey('Project',on_delete=models.CASCADE)
