from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import ProjectSerializer
from .models import Project, ProjectManager, TeamManager, TeamMember
from gdm_app import serializers
from django.http import Http404

# Create your views here.

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
                context[e.team.project.id] += ["Team Manager"+":"+team_name]
            else:
                context[e.team.project.id] = ["Team Manager"+":"+team_name]



        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            queryset.add(e.team.project)
            team_name = e.team.name
            if e.team.project.id in context:
                context[e.team.project.id] += ["Team Member"+":"+team_name]
            else:
                context[e.team.project.id] = ["Team Member"+":"+team_name]


        serializer = ProjectSerializer(queryset,context=context,many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None):
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
                    context[e.team.project.id] += ["Team Manager"+":"+team_name]
                else:
                    context[e.team.project.id] = ["Team Manager"+":"+team_name]



        for e in TeamMember.objects.filter(base_user__exact=self.request.user):
            if e.team.project.id == int(pk):
                queryset.add(e.team.project)
                team_name = e.team.name
                if e.team.project.id in context:
                    context[e.team.project.id] += ["Team Member"+":"+team_name]
                else:
                    context[e.team.project.id] = ["Team Member"+":"+team_name]

        if len(queryset) == 0:
            raise Http404
        serializer = ProjectSerializer(queryset,context=context,many=True)
        return Response(serializer.data)
    