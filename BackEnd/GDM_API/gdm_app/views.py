from django.contrib.auth import base_user
from django.db.models.base import Model
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.serializers import Serializer
from .serializers import ProjectSerializer, TaskSerializer
from .models import Deadline, NormalUser, Project, ProjectManager, Task, Team, TeamManager, TeamMember
from gdm_app import serializers
from django.http import Http404
from django.db.models import Q, query
import datetime,time,calendar

# Create your views here.



class TaskView(viewsets.ViewSet):

    def list(self,request,project_pk=None):
        queryset = set()
        if request.query_params['role'] == 'Project Manager':
            prjs = ProjectManager.objects.filter(base_user__exact=self.request.user)
            if prjs.count() != 0 and prjs.filter(id__exact=project_pk).count() != 0:
                queryset = Task.objects.filter(project__exact=project_pk)
        elif request.query_params['role'] == 'Team Manager':
            team = TeamManager.objects.filter(base_user__exact=self.request.user).first().team
            queryset = Task.objects.filter(Q(assigned_to_team__exact=team)|Q(assigned_to__exact=self.request.user))
        else:
            queryset = Task.objects.filter(assigned_to__exact=self.request.user)
        
        serializer = TaskSerializer(queryset,many=True)
        return Response(serializer.data)


    def retrieve(self, request,pk=None,project_pk=None):
        if Task.objects.filter(id__exact=pk).count() == 0:
            raise Http404

        task = Task.objects.filter(id__exact=pk).first()
        context = {"assigned_to":task.assigned_to,"assigned_to_team":task.assigned_to_team}
        if ProjectManager.objects.filter(project__exact=task.project).count() != 0 and ProjectManager.objects.filter(project__exact=task.project).first().base_user == self.request.user:
            return Response(TaskSerializer(task,context=context).data)
        if task.assigned_to_team is not None:
            if TeamManager.objects.filter(team__exact=task.assigned_to_team).count() != 0 and  TeamManager.objects.filter(team__exact=task.assigned_to_team).first().base_user == self.request.user:
                return Response(TaskSerializer(task,context=context).data)
            else:
                if task.assigned_to == self.request.user:
                    return Response(TaskSerializer(task,context=context).data)
                else:
                    raise Http404
        else:
            if task.assigned_to == self.request.user:
                return Response(TaskSerializer(task,context=context).data)
            else:
                raise Http404

    def create(self,request,project_pk=None):
        params = request.data
        print(params)
        pass
        deadline = Deadline(name=params["title"],
            start_date=datetime.datetime.now(),
                end_date=params["deadline"],
                    project=Project.objects.filter(id__exact=project_pk).first())
        deadline.save()
        task = Task(title=params["title"],
                        creator=self.request.user,
                            assigned_to=NormalUser.objects.filter(id__exact=params["assigned_to"]).first() if params["assigned_to"] is not None else None,
                                assigned_to_team=Team.objects.filter(id__exact=params["assigned_to_team"]).first() if params["assigned_to_team"] is not None else None,
                                    project=Project.objects.filter(id__exact=project_pk).first())
        task.save()
        task.deadlines.add(deadline)
        return Response({"status":"ok"})







class ProjectView(viewsets.ViewSet):

    def list(self,request):
        queryset = set()
        context = {}


        for e in ProjectManager.objects.filter(base_user__exact=self.request.user):
            queryset.add(e.project)
            if e.project.id in context:
                context[e.project.id] += ["Project Manager"]
            else:
                context[e.project.id] = ["Project Manager"]



        for e in TeamManager.objects.filter(base_user__exact=self.request.user):
            queryset.add(e.team.project)
            team_name = e.team.name
            if e.team.project.id in context:
                context[e.team.project.id] += ["Team Manager"]
            else:
                context[e.team.project.id] = ["Team Manager"]



        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            queryset.add(e.team.project)
            team_name = e.team.name
            if e.team.project.id in context:
                context[e.team.project.id] += ["Team Member"]
            else:
                context[e.team.project.id] = ["Team Member"]


        serializer = ProjectSerializer(queryset,context=context,many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if Project.objects.filter(id__exact=pk).count() == 0:
            raise Http404


        queryset = set()
        context = {}
    

        for e in ProjectManager.objects.filter(base_user__exact=self.request.user):
            if e.project.id == int(pk):
                queryset.add(e.project)
                if e.project.id in context:
                    context[e.project.id] += ["Project Manager"]
                else:
                    context[e.project.id] = ["Project Manager"]



        for e in TeamManager.objects.filter(base_user__exact=self.request.user):
            if e.team.project.id == int(pk):
                queryset.add(e.team.project)
                team_name = e.team.name
                if e.team.project.id in context:
                    context[e.team.project.id] += ["Team Manager"]
                else:
                    context[e.team.project.id] = ["Team Manager"]



        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            if e.team.project.id == int(pk):
                queryset.add(e.team.project)
                team_name = e.team.name
                if e.team.project.id in context:
                    context[e.team.project.id] += ["Team Member"]
                else:
                    context[e.team.project.id] = ["Team Member"]

        if len(queryset) == 0:
            raise Http404
        serializer = ProjectSerializer(next(iter(queryset)),context=context)
        return Response(serializer.data)
    