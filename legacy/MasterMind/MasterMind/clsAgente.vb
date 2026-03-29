Imports System.Data
Imports System.IO
Imports System.Math
Imports System.Data.OleDb
Imports System.Exception

Public Class clsAgente
    Public KBase As DataTable
    Public Jugadas As DataTable
    Public tempDT As DataTable
    Public nEx As Integer = -1
    Dim strConn As String = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=""" & Application.StartupPath.ToString() & "\kbase.mdb"""
    Dim conn As OleDbConnection
    Public Sub New()
        '' hace un clon de las jugadas
        nEx = -1 '' exitos inicializados
        Jugadas = New DataTable
        Jugadas.Columns.Add("nex")
        Jugadas.Columns.Add("j1")
        Jugadas.Columns.Add("j2")
        Jugadas.Columns.Add("j3")
        Jugadas.Columns.Add("j4")
        Jugadas.Columns.Add("j5")
        Dim comando As OleDbCommand
        Dim dt As New DataTable
        Dim da As New OleDbDataAdapter("select * from kbasejugadas", strConn)
        da.Fill(dt)
        conn = New OleDbConnection(strConn)
        conn.Open()
        comando = New OleDbCommand
        comando.Connection = conn
        comando.CommandType = CommandType.Text
        comando.CommandText = "delete * from jugadas;"
        comando.ExecuteNonQuery()
        Dim strComm As String
        strComm = "insert into jugadas(j1,j2,j3,j4,j5) values({0},{1},{2},{3},{4})"
        For Each dr As DataRow In dt.Rows
            comando = New OleDbCommand
            comando.Connection = conn
            comando.CommandType = CommandType.Text
            comando.CommandText = String.Format(strComm, dr(0), dr(1), dr(2), dr(3), dr(4))
            comando.ExecuteNonQuery()
        Next
    End Sub
    Public Function RandomNumber(ByVal MaxNumber As Integer, Optional ByVal MinNumber As Integer = 0) As Integer
        Dim random As New Random(System.DateTime.Now.Millisecond * System.DateTime.Now.Second * System.DateTime.Now.Minute)
        Return random.Next(MinNumber, MaxNumber + 1)
    End Function

    Public Function jugar() As Array
        Dim arrJugada As Array
        Dim da As OleDbDataAdapter
        Dim dt As DataTable
        If Jugadas.Rows.Count = 0 Then
            '' nunca ha jugado
            '' 1) Selecciona Combinación Aleatoria de la muestra completa
            da = New OleDbDataAdapter("select * from jugadas", strConn)
            dt = New DataTable
            Try
                da.Fill(dt)
                If dt.Rows.Count > 0 Then
                    Dim arrJugada1(4) As Integer
                    Dim nRow As Integer = RandomNumber(dt.Rows.Count - 1, 0)
                    For n As Integer = 0 To dt.Columns.Count - 1
                        arrJugada1(n) = dt.Rows(nRow)(n)
                    Next
                    arrJugada = arrJugada1
                    Me.Jugadas.Rows.Add(-1, arrJugada(0), arrJugada(1), arrJugada(2), arrJugada(3), arrJugada(4))
                Else
                    Throw New Exception("No existe base de conocimientos")
                End If
            Catch ex As Exception
                Throw New Exception(ex.Message)
            End Try
        Else
            '' Ya ha jugado alguna vez
            arrJugada = jugadaPosterior()
        End If
        Return arrJugada
    End Function

    Private Function jugadaPosterior() As Array
        '' jugada cuando tiene aciertos
        ' 1) Busca las jugadas pibote necesarias
        Dim arrPibotes(4) As Integer
        Dim arrJugadaAnt(4) As Integer
        Dim arrJugada(4) As Integer
        Dim da As OleDbDataAdapter
        Dim dt As New DataTable
        '' primero busca jugadas en 0!!!! borra las jugadas en 0 y todas sus posibilidades
        If nEx = 0 Then
            '' la jugada está en 0
            '' borrar la jugada y todas las que se parezcan
            Dim jugadaZero(4) As Integer
            For n As Integer = 1 To Jugadas.Columns.Count - 1
                Dim comando As New OleDbCommand
                comando.Connection = conn
                comando.CommandType = CommandType.Text
                comando.CommandText = "DELETE * FROM jugadas where j" & n & " = " & Jugadas.Rows(Jugadas.Rows.Count - 1)(n) & " "
                comando.ExecuteNonQuery()
            Next
            '' deberia buscar de nuevo en la base de conocimiento!!!! aleatoriamente!!!
            da = New OleDbDataAdapter("select * from jugadas", strConn)
            dt = New DataTable
            Try
                da.Fill(dt)
                If dt.Rows.Count > 0 Then
                    Dim arrJugada1(4) As Integer
                    Dim nRow As Integer = RandomNumber(dt.Rows.Count - 1, 0)
                    For n As Integer = 0 To dt.Columns.Count - 1
                        arrJugada1(n) = dt.Rows(nRow)(n)
                    Next
                    arrJugada = arrJugada1
                    Me.Jugadas.Rows.Add(0, arrJugada(0), arrJugada(1), arrJugada(2), arrJugada(3), arrJugada(4))
                Else
                    MsgBox("No existe base de conocimientos", MsgBoxStyle.Critical)
                End If
            Catch ex As Exception
                MsgBox(ex.Message, MsgBoxStyle.Critical)
            End Try
        Else
            Dim nexpar As String
            nexpar = "nex = " & nEx & " "
            '' si fué exitosa busca solo de los pibotes!!
            '' busca las jugadas pibote
            da = New OleDbDataAdapter("select * from kbasepibotes where " & nexpar & " ", strConn)
            Dim dtPibotes = New DataTable
            da.Fill(dtPibotes)
            If dtPibotes.Rows.Count > 0 Then
selectPibote:
                Dim strNuevoSQL As String = ""
                Dim nRow As Integer = RandomNumber(dtPibotes.Rows.Count - 1, 0)
                For n As Integer = 0 To arrPibotes.Length - 1
                    arrJugadaAnt(n) = Jugadas.Rows(Jugadas.Rows.Count - 1)(n + 1) '' ULtima Jugada
                    'Try
                    arrPibotes(n) = dtPibotes.Rows(nRow)(n + 1) '' Pibotes
                    'Catch ex As Exception
                    'arrPibotes(n) = 0 '' Pibotes
                    'End Try
                    If arrPibotes(n) = 1 Then
                        '' se queda fijo el anterior
                        strNuevoSQL += " j" & n + 1 & " = " & arrJugadaAnt(n) & " AND"
                    Else
                        '' fuerza a que se sea otro diferente
                        strNuevoSQL += " j" & n + 1 & " <> " & arrJugadaAnt(n) & " AND"
                    End If
                Next
                '' 2) ya que tiene los pibotes calcula la nueva combinación ganadora!!!
                da = New OleDbDataAdapter("select * from jugadas where " & strNuevoSQL & " 1=1 ", strConn)
                dt = New DataTable
                da.Fill(dt)
                If dt.Rows.Count > 0 Then
                    '' ya que tiene las combinaciones selecciona una y la juega
                    Dim arrJugada1(4) As Integer
                    nRow = RandomNumber(dt.Rows.Count - 1, 0)
                    For n As Integer = 0 To dt.Columns.Count - 1
                        arrJugada1(n) = dt.Rows(nRow)(n)
                    Next
                    arrJugada = arrJugada1
                    Me.Jugadas.Rows.Add(nEx, arrJugada(0), arrJugada(1), arrJugada(2), arrJugada(3), arrJugada(4))
                    '' el nEx es del juego anterior!!!!
                Else                   
                    GoTo selectPibote
                End If
            Else
                MsgBox("No hay jugadas en la base de conocimiento" & vbCrLf & "select * from kbasepibotes where " & nexpar & "  ")
            End If
        End If
        Return arrJugada
    End Function
    Public Function getJugadas() As DataTable
        Return Jugadas
    End Function
    Public Function getBaseActual() As DataTable
        Dim dt As New DataTable
        Dim da As New OleDbDataAdapter("select * from jugadas", strConn)
        da.Fill(dt)
        Return dt
    End Function
End Class
