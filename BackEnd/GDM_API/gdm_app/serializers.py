from django.db.models import fields
from rest_framework import serializers
from .models import Deadline, NormalUser, Project, ProjectManager,Team,Task, TeamManager, TeamMember
"""
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


"""
class NormalUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NormalUser
        fields = ('id','first_name','last_name')

class TaskSerializer(serializers.ModelSerializer):

    """
    deadline = serializers.SerializerMethodField(method_name='date_deadline')
    assigned_to = serializers.SerializerMethodField(method_name='get_assigned_to')
    assigned_to_team = serializers.SerializerMethodField(method_name='get_assigned_to_team')
    def date_deadline(self,tsk):
        if tsk.deadlines.count() == 0:
            return ""
        return tsk.deadlines.first().end_date 


    def get_assigned_to(self,tsk):
        if "assigned_to" not in self.context:
            return None
        return NormalUserSerializer(self.context["assigned_to"]).data

    def get_assigned_to_team(self,tsk):
        if "assigned_to_team" not in self.context:
            return None
        return TeamSerializer(self.context["assigned_to_team"]).data
    """
    creator = NormalUserSerializer()
    assigned_to = NormalUserSerializer()
    class Meta:
        exclude = ['project']
        model = Task
        #fields = '__all__'
        depth = 1











class ProjectSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField(method_name='num_members')
    tasks = serializers.SerializerMethodField(method_name='num_tasks')
    deadline = serializers.SerializerMethodField(method_name='date_deadline')
    roles = serializers.SerializerMethodField(method_name='get_roles')
    
    def num_members(self,prj):
        total = 0
        total += ProjectManager.objects.filter(project__exact=prj).count()
        Teams  =  Team.objects.filter(project__exact=prj)
        total +=  TeamManager.objects.filter(team__in=Teams).count()
        total  += TeamMember.objects.filter(team__in=Teams).count()
        return total

    
    def num_tasks(self,prj):
        return Task.objects.filter(project__exact=prj).count()


    def date_deadline(self,prj):
        if prj.main_deadline is None:
            return ""
        return prj.main_deadline.end_date 


    def get_roles(self,prj):
        return self.context[prj.id]

    class Meta:
        model = Project
        fields = ('id','title', 'deadline','members','tasks','roles')